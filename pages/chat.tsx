import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "いらっしゃいませ。どうなさいましたか？" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "それは対応できません。" },
      ]);
    }, 500);
    setInput("");
  };

  return (
    <div style={{ background: "#fff", color: "#000", padding: 20 }}>
      <h2>カスハラ対応ロープレ</h2>
      <div style={{ height: 300, overflowY: "scroll", border: "1px solid #ccc", padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === "user" ? "right" : "left" }}>
            <p><b>{msg.from === "user" ? "あなた" : "クレーマー"}:</b> {msg.text}</p>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="入力してEnter"
        style={{ width: "80%", marginTop: 10 }}
      />
      <button onClick={send}>送信</button>
    </div>
  );
}
