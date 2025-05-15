import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { history } = req.body;

  const userTurns = history.filter((m: any) => m.role === "user").length;

  const messagesWithSystem = [
    {
      role: "system",
      content: `
あなたは「理不尽なクレームを入れる顧客」のロールプレイをするAIです。

【会話ルール】
- ユーザーは企業スタッフ。あなたは理不尽に怒る顧客。
- 会話が5ターン目以降の場合、ユーザーが対応しやすいようなヒントを返答の末尾に「【ヒント】〜〜〜」形式で必ず追加してください。
- ヒントが不要でも「【ヒント】なし」と必ず付けてください（UI判定のため）。
- 会話が10ターン目を超えたら、「まあいいや」「納得した」などのワードを必ず含めて締めの雰囲気にしてください。

【出力例】
本文...。
【ヒント】〜〜〜（1文）

【出力条件】
- 出力は日本語の話し言葉
- 【ヒント】は必ず「【ヒント】」から始める
- 絶対にヒントを省略しない
`,
    },
    ...history,
  ];

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messagesWithSystem,
    });

    const reply = completion.data.choices[0].message?.content || "応答が得られませんでした。";

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ reply: "APIエラーが発生しました。" });
  }
}
