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

  const send = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
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

      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
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
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="入力してEnter"
        style={{ width: "80%" }}
        disabled={loading}
      />
      <button onClick={send} disabled={loading}>
        送信
      </button>
    </div>
  );
}
