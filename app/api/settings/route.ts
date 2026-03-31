import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ENV_PATH = path.join(process.cwd(), ".env.local");
const VERCEL_PROJECT_ID = "prj_xTptrbuZM0t0e0B5T6q73Uw0xPly";
const VERCEL_TEAM_ID = "team_KE6b9nfqorq2fi9x70aJhhVV";
const GH_OWNER = "yamanakahiroshizeirishi-pixel";
const GH_REPO = "craft-beer-mood";

function readLocalEnv(): Record<string, string> {
  if (!fs.existsSync(ENV_PATH)) return {};
  const lines = fs.readFileSync(ENV_PATH, "utf-8").split("\n");
  const env: Record<string, string> = {};
  for (const line of lines) {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  return env;
}

function writeLocalEnv(env: Record<string, string>) {
  const content = Object.entries(env).map(([k, v]) => `${k}=${v}`).join("\n") + "\n";
  fs.writeFileSync(ENV_PATH, content, "utf-8");
}

async function upsertVercelEnv(token: string, key: string, value: string) {
  const listRes = await fetch(
    `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await listRes.json();
  const existing = (data.envs as Array<{ key: string; target: string[]; id: string }> | undefined)
    ?.find((e) => e.key === key && e.target?.includes("production"));

  if (existing) {
    await fetch(
      `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env/${existing.id}?teamId=${VERCEL_TEAM_ID}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      }
    );
  } else {
    await fetch(
      `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, type: "encrypted", target: ["production", "preview"] }),
      }
    );
  }
}

async function triggerRedeploy(ghToken: string) {
  const headers = {
    Authorization: `Bearer ${ghToken}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
  };

  // Get current HEAD
  const refRes = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/refs/heads/master`,
    { headers }
  );
  const refData = await refRes.json();
  const currentSha = refData.object?.sha;
  if (!currentSha) return;

  // Get tree SHA from current commit
  const commitRes = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/commits/${currentSha}`,
    { headers }
  );
  const commitData = await commitRes.json();
  const treeSha = commitData.tree?.sha;
  if (!treeSha) return;

  // Create empty commit
  const newCommitRes = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/commits`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: "chore: update settings [skip ci]",
        tree: treeSha,
        parents: [currentSha],
      }),
    }
  );
  const newCommit = await newCommitRes.json();
  if (!newCommit.sha) return;

  // Update branch ref
  await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/git/refs/heads/master`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({ sha: newCommit.sha }),
    }
  );
}

export async function GET() {
  if (process.env.VERCEL) {
    return NextResponse.json({
      gmailUser: process.env.GMAIL_USER || "",
      configured: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
    });
  }
  const env = readLocalEnv();
  return NextResponse.json({
    gmailUser: env.GMAIL_USER || "",
    configured: !!(env.GMAIL_USER && env.GMAIL_APP_PASSWORD),
  });
}

export async function POST(request: NextRequest) {
  const { gmailUser, gmailAppPassword } = await request.json();
  if (!gmailUser || !gmailAppPassword) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
  }

  if (process.env.VERCEL) {
    const vercelToken = process.env.VERCEL_ADMIN_TOKEN;
    const ghToken = process.env.GH_TOKEN;
    if (!vercelToken || !ghToken) {
      return NextResponse.json({ error: "管理トークンが設定されていません" }, { status: 500 });
    }
    try {
      await upsertVercelEnv(vercelToken, "GMAIL_USER", gmailUser);
      await upsertVercelEnv(vercelToken, "GMAIL_APP_PASSWORD", gmailAppPassword);
      await upsertVercelEnv(vercelToken, "NEXT_PUBLIC_BASE_URL", "https://craft-beer-mood.vercel.app");
      await triggerRedeploy(ghToken);
      return NextResponse.json({ success: true });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: "設定の保存に失敗しました" }, { status: 500 });
    }
  }

  // Local development
  const env = readLocalEnv();
  env.GMAIL_USER = gmailUser;
  env.GMAIL_APP_PASSWORD = gmailAppPassword;
  env.NEXT_PUBLIC_BASE_URL = env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  writeLocalEnv(env);
  return NextResponse.json({ success: true });
}
