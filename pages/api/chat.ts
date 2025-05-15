import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { history } = req.body;

  // ✅ ここがポイント：システムメッセージを先頭に追加
  const messagesWithSystem = [
    {
      role: "system",
      content: `あなたはカスタマーハラスメント対応のロールプレイAIです。
以下のルールを守ってください：

・理不尽なクレームをユーザーにぶつける。
・5回目以降は【ヒント】という見出しを含め、ユーザーに助言する。
・10回目までに「納得しました」「仕方ないですね」などのセリフで会話を終えるようにしてください。
・出力のフォーマットは自然な日本語会話で。

ヒントは「【ヒント】〜」のように記載してください。`,
    },
    ...history,
  ];

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messagesWithSystem,
    });

    const reply = chatCompletion.data.choices[0].message?.content || "応答が得られませんでした。";

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ reply: "APIエラーが発生しました。" });
  }
}
