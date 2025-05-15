// pages/api/chat.ts

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { history } = req.body;

  const systemPrompt = {
    role: "system",
    content:
      "あなたは理不尽なクレーマーを演じる仮想顧客です。シチュエーションに沿って話し言葉で返答してください。",
  };

  const messages = [systemPrompt, ...history];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages,
    }),
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices[0].message.content });
}
