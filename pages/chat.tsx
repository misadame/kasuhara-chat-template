import { useState } from "react";

type Message = { from: "user" | "bot"; text: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text:
        "私は仮想のお客様です。今から理不尽なクレームをいれます。\n業種とシチュエーションを教えてください。\n以後、話し言葉でお願いします。",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ ユーザーの発言回数を数える
  const userMessageCount = messages.filter((m) => m.from === "user").length;

  // ✅ 表示するヒント一覧
  const hints = [
    "謝罪 + 提案（返金や交換）をセットで伝えると効果的です。",
    "相手の要求をすぐ否定せず、まず共感を示す言葉から始めましょう。",
    "一度相手の言葉を繰り返して、正確に意図を汲んでいることを見せましょう。",
    "対応内容は簡潔に、主張しすぎずを心がけましょう。",
    "事実を伝えるときは柔らかい言葉で伝えるのがポイントです。"
  ];

  const send = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user" as const, text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: newMessages.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = await response.json();

      setMessages((prev) => [...prev, { from: "bot" as const, text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "エラーが発生しました。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#fff", color: "#000", padding: 20 }}>
      <h2>カスハラ対応ロープレ</h2>

      <div
        style={{
          height: 300,
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{ textAlign: msg.from === "user" ? "right" : "left" }}
          >
            <p>
              <b>{msg.from === "user" ? "あなた" : "クレーマー"}:</b>{" "}
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ ヒント表示：2ターン目から出現 */}
      {userMessageCount >= 1 && (
        <div
          style={{
            backgroundColor: "#f0f4ff",
            borderLeft: "4px solid #3b82f6",
            padding: "10px",
            marginBottom: "10px",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        >
          💡ヒント：{hints[(userMessageCount - 1) % hints.length]}
        </div>
      )}

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        placeholder="Shift + Enter で送信"
        style={{ width: "80%", height: "60px" }}
        disabled={loading}
      />
      <button onClick={send} disabled={loading}>
        送信
      </button>
    </div>
  );
}
