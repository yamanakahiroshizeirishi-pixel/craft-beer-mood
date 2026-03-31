"use client";

import { useState, useEffect } from "react";

interface Recipient {
  id: number;
  name: string;
  email: string;
  status: "idle" | "success" | "error";
  errorMsg?: string;
}

interface SendResult {
  email: string;
  name: string;
  success: boolean;
  error: string | null;
}

let nextId = 1;
function newRecipient(): Recipient {
  return { id: nextId++, name: "", email: "", status: "idle" };
}

export default function AdminPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([newRecipient()]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [gmailUser, setGmailUser] = useState("");
  const [gmailPass, setGmailPass] = useState("");
  const [configured, setConfigured] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setConfigured(d.configured);
        if (d.gmailUser) setGmailUser(d.gmailUser);
        if (!d.configured) setShowSettings(true);
      });
  }, []);

  function updateRecipient(id: number, field: "name" | "email", value: string) {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value, status: "idle" } : r))
    );
  }

  function addRow() {
    setRecipients((prev) => [...prev, newRecipient()]);
  }

  function removeRow(id: number) {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const lines = text.trim().split("\n").filter(Boolean);
    const parsed: Recipient[] = lines.map((line) => {
      const parts = line.split(/[\t,]/).map((s) => s.trim());
      return {
        id: nextId++,
        name: parts[0] || "",
        email: parts[1] || parts[0] || "",
        status: "idle",
      };
    });
    if (parsed.length > 0) setRecipients(parsed);
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg("");
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gmailUser, gmailAppPassword: gmailPass }),
    });
    if (res.ok) {
      setConfigured(true);
      setShowSettings(false);
      setSettingsMsg("保存しました。反映まで約1分かかります（自動再デプロイ中）");
    } else {
      const data = await res.json().catch(() => ({}));
      setSettingsMsg(data.error || "保存に失敗しました");
    }
    setSavingSettings(false);
  }

  async function handleSendAll(e: React.FormEvent) {
    e.preventDefault();
    const valid = recipients.filter((r) => r.name && r.email);
    if (valid.length === 0) return;
    setSending(true);
    setDone(false);

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipients: valid.map((r) => ({ name: r.name, email: r.email })) }),
    });

    const data = await res.json();

    if (!res.ok) {
      setRecipients((prev) =>
        prev.map((r) => ({ ...r, status: "error" as const, errorMsg: data.error }))
      );
    } else {
      const resultMap: Record<string, SendResult> = {};
      for (const r of data.summary as SendResult[]) resultMap[r.email] = r;
      setRecipients((prev) =>
        prev.map((r) => {
          const result = resultMap[r.email];
          if (!result) return r;
          return {
            ...r,
            status: result.success ? "success" : "error",
            errorMsg: result.error || undefined,
          };
        })
      );
      setSuccessCount(data.successCount);
      setDone(true);
    }
    setSending(false);
  }

  const validCount = recipients.filter((r) => r.name && r.email).length;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🍺</div>
          <h1 className="text-2xl font-bold text-gray-800">クラフトビールセレクション</h1>
          <p className="text-gray-500 text-sm mt-1">気分に合うビールをメールでご提案します</p>
        </div>

        {/* Settings Panel */}
        <div className="bg-white rounded-2xl shadow mb-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">⚙️</span>
              <span className="font-semibold text-gray-700">Gmail設定</span>
              {configured ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ 設定済み ({gmailUser})</span>
              ) : (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">⚠ 未設定</span>
              )}
            </div>
            <span className="text-gray-400">{showSettings ? "▲" : "▼"}</span>
          </button>

          {showSettings && (
            <form onSubmit={saveSettings} className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                <p className="font-bold mb-1">📋 Gmailアプリパスワードの取得方法</p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Googleアカウント → セキュリティ → 2段階認証を有効化</li>
                  <li>「アプリパスワード」で16桁のパスワードを生成</li>
                  <li>下のフォームに入力して保存</li>
                </ol>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Gmailアドレス</label>
                <input
                  type="email"
                  value={gmailUser}
                  onChange={(e) => setGmailUser(e.target.value)}
                  placeholder="your-email@gmail.com"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">アプリパスワード（16桁）</label>
                <input
                  type="password"
                  value={gmailPass}
                  onChange={(e) => setGmailPass(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              {settingsMsg && <p className="text-sm text-green-600">{settingsMsg}</p>}
              <button
                type="submit"
                disabled={savingSettings}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-bold rounded-lg transition-colors"
              >
                {savingSettings ? "保存中..." : "保存"}
              </button>
            </form>
          )}
        </div>

        {/* Send Result Banner */}
        {done && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3">
            <span className="text-2xl">✉️</span>
            <div>
              <p className="font-bold text-green-700">送信完了！</p>
              <p className="text-sm text-green-600">{successCount} 件送信成功 / {recipients.filter(r=>r.name&&r.email).length} 件</p>
            </div>
            <button
              onClick={() => { setDone(false); setRecipients([newRecipient()]); }}
              className="ml-auto text-xs px-3 py-1.5 border border-green-300 text-green-700 rounded-lg hover:bg-green-100"
            >
              リセット
            </button>
          </div>
        )}

        {/* Recipient List */}
        <form onSubmit={handleSendAll} className="bg-white rounded-2xl shadow">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-700">送信リスト</h2>
              <p className="text-xs text-gray-400 mt-0.5">名前・メールアドレスを入力。CSVペーストにも対応</p>
            </div>
            <span className="text-sm text-gray-500">{validCount} 件</span>
          </div>

          {/* CSV paste area */}
          <div className="px-4 pt-3">
            <textarea
              placeholder="CSVペースト：「名前,メール」または「名前[Tab]メール」の形式で複数行貼り付け"
              rows={2}
              onPaste={handlePaste}
              readOnly
              className="w-full px-3 py-2 text-xs border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 resize-none focus:outline-none focus:border-amber-300 cursor-pointer"
            />
          </div>

          {/* Recipients table */}
          <div className="p-4 space-y-2">
            {recipients.map((r, idx) => (
              <div key={r.id} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-5 text-right flex-shrink-0">{idx + 1}</span>
                <input
                  type="text"
                  value={r.name}
                  onChange={(e) => updateRecipient(r.id, "name", e.target.value)}
                  placeholder="お名前"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <input
                  type="email"
                  value={r.email}
                  onChange={(e) => updateRecipient(r.id, "email", e.target.value)}
                  placeholder="メールアドレス"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                {/* Status indicator */}
                {r.status === "success" && <span className="text-green-500 flex-shrink-0">✓</span>}
                {r.status === "error" && (
                  <span className="text-red-500 flex-shrink-0" title={r.errorMsg}>✗</span>
                )}
                {r.status === "idle" && <div className="w-4 flex-shrink-0" />}
                <button
                  type="button"
                  onClick={() => removeRow(r.id)}
                  disabled={recipients.length === 1}
                  className="text-gray-300 hover:text-red-400 disabled:opacity-30 flex-shrink-0 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Error messages */}
            {recipients.some((r) => r.status === "error") && (
              <div className="mt-2 space-y-1">
                {recipients.filter((r) => r.status === "error").map((r) => (
                  <p key={r.id} className="text-xs text-red-600">⚠ {r.email}: {r.errorMsg}</p>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={addRow}
              className="w-full py-2 border-2 border-dashed border-gray-200 hover:border-amber-300 text-gray-400 hover:text-amber-500 rounded-lg text-sm transition-colors"
            >
              + 宛先を追加
            </button>
          </div>

          <div className="p-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={sending || validCount === 0 || !configured}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              {sending
                ? "送信中..."
                : !configured
                ? "⚠️ Gmail設定が必要です"
                : `🍺 ${validCount} 件に一括送信`}
            </button>
          </div>
        </form>

        {/* Demo links */}
        <div className="mt-4 bg-white rounded-xl shadow p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">デモ</p>
          <a href="/mood" className="block text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors">
            気分選択ページを開く →
          </a>
          <a href="/craft-beer-mood-src.zip" download className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 text-sm font-medium transition-colors">
            ⬇️ ソースコードをダウンロード (.zip)
          </a>
        </div>
      </div>
    </main>
  );
}
