import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateMoodEmail } from "@/lib/emailTemplate";

interface Recipient {
  name: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const { recipients } = await request.json() as { recipients: Recipient[] };

    if (!recipients || recipients.length === 0) {
      return NextResponse.json({ error: "宛先が指定されていません" }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      return NextResponse.json(
        { error: "Gmail設定が未完了です。設定パネルでGmailアドレスとアプリパスワードを入力してください。" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const results = await Promise.allSettled(
      recipients.map(async ({ name, email }) => {
        const html = generateMoodEmail(baseUrl, name);
        await transporter.sendMail({
          from: `"クラフトビールセレクション 🍺" <${gmailUser}>`,
          to: email,
          subject: `🍺 ${name}さん、今日の気分に合うクラフトビールは？`,
          html,
        });
        return { email, name };
      })
    );

    const summary = results.map((r, i) => ({
      email: recipients[i].email,
      name: recipients[i].name,
      success: r.status === "fulfilled",
      error: r.status === "rejected" ? String((r as PromiseRejectedResult).reason) : null,
    }));

    const successCount = summary.filter((r) => r.success).length;

    return NextResponse.json({ summary, successCount, total: recipients.length });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "メール送信中にエラーが発生しました" }, { status: 500 });
  }
}
