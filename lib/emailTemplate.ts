import { moodData, moods } from "./beerData";

export function generateMoodEmail(baseUrl: string, recipientName: string): string {
  const moodButtons = moods
    .map((mood) => {
      const data = moodData[mood];
      const colorMap: Record<string, string> = {
        "text-yellow-700": "#b45309",
        "text-green-700": "#15803d",
        "text-red-700": "#b91c1c",
        "text-indigo-700": "#4338ca",
        "text-pink-700": "#be185d",
      };
      const bgMap: Record<string, string> = {
        "bg-yellow-50 border-yellow-300": "#fefce8",
        "bg-green-50 border-green-300": "#f0fdf4",
        "bg-red-50 border-red-300": "#fef2f2",
        "bg-indigo-50 border-indigo-300": "#eef2ff",
        "bg-pink-50 border-pink-300": "#fdf2f8",
      };
      const borderMap: Record<string, string> = {
        "bg-yellow-50 border-yellow-300": "#fde047",
        "bg-green-50 border-green-300": "#86efac",
        "bg-red-50 border-red-300": "#fca5a5",
        "bg-indigo-50 border-indigo-300": "#a5b4fc",
        "bg-pink-50 border-pink-300": "#f9a8d4",
      };

      const textColor = colorMap[data.color] || "#374151";
      const bgColor = bgMap[data.bgColor] || "#f9fafb";
      const borderColor = borderMap[data.bgColor] || "#d1d5db";

      return `
        <a href="${baseUrl}/recommend?mood=${mood}"
           style="display: block; text-decoration: none; margin: 8px 0; padding: 16px 20px;
                  background-color: ${bgColor}; border: 2px solid ${borderColor};
                  border-radius: 12px; color: ${textColor};">
          <span style="font-size: 24px;">${data.emoji}</span>
          <span style="font-size: 18px; font-weight: bold; margin-left: 12px;">${data.label}</span>
          <span style="font-size: 14px; color: #6b7280; margin-left: 8px;">— ${data.description}</span>
        </a>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>今日の気分に合うクラフトビール</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 40px 40px 32px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 48px;">🍺</p>
              <h1 style="margin: 0 0 8px; font-size: 24px; color: #ffffff; font-weight: bold;">
                今日の気分はどうですか？
              </h1>
              <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.85);">
                あなたの気分に合ったクラフトビールをご提案します
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 40px 16px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #374151;">
                ${recipientName} さん、こんにちは！
              </p>
              <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
                今日の気分を選ぶと、あなたにぴったりのクラフトビールをご提案します。<br>
                気分をクリックして、今夜の一杯を見つけましょう！
              </p>
            </td>
          </tr>

          <!-- Mood Buttons -->
          <tr>
            <td style="padding: 16px 40px 32px;">
              <p style="margin: 0 0 16px; font-size: 14px; font-weight: bold; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">
                今の気分を選んでください
              </p>
              ${moodButtons}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af;">
                🍺 クラフトビールセレクション
              </p>
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                このメールは自動送信されました。
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
