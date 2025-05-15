import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (code === "pass123") {
      router.push("/chat");
    } else {
      alert("コードが間違っています");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>認証コードを入力してください</h1>
      <input
        type="password"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="コードを入力"
      />
      <button onClick={handleLogin}>ログイン</button>
    </div>
  );
}
