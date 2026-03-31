import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ENV_PATH = path.join(process.cwd(), ".env.local");

function readEnv(): Record<string, string> {
  if (!fs.existsSync(ENV_PATH)) return {};
  const lines = fs.readFileSync(ENV_PATH, "utf-8").split("\n");
  const env: Record<string, string> = {};
  for (const line of lines) {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  return env;
}

function writeEnv(env: Record<string, string>) {
  const content = Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n") + "\n";
  fs.writeFileSync(ENV_PATH, content, "utf-8");
}

export async function GET() {
  const env = readEnv();
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
  const env = readEnv();
  env.GMAIL_USER = gmailUser;
  env.GMAIL_APP_PASSWORD = gmailAppPassword;
  env.NEXT_PUBLIC_BASE_URL = env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  writeEnv(env);
  return NextResponse.json({ success: true });
}
