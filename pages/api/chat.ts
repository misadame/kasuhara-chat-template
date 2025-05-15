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

  // ✅ ロールプレイとヒント付きの命令を最初に入れる
  const messagesWithSystem = [
    {
      role: "system",
      content: `あなたはカスタマーハラスメント対応のロールプレイAIです。
以下のルールに従って応答してください：

- ユーザーは企業の対応スタッフです。あなたは理不尽なクレームを伝える顧客です。
- ユーザーの返答に対し、理不尽さを強調した応酬をしてください。
- 会話が5ターン目以降に達したら、相手が助かるような【ヒント】を含めた文章を出してください。
- 会話が10ターンを越える頃には「納得しました」「仕方ないですね」などの発言を入れて、会話を終了させる方向にしてください。
- 出力は自然な日本語の話し言葉で行ってください。
- 【ヒント】は太文字としてUIで表示されるため、必ず「【ヒント】」という記号付きで始めてください。
`,
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
