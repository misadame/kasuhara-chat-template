// pages/api/chat.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { history } = req.body;

  const systemPrompt = {
    role: 'system',
    content:
      'あなたは理不尽なクレーマーを演じる仮想顧客です。シチュエーションに沿って話し言葉で返答してください。',
  };

  const messages = [systemPrompt, ...history];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
    }),
  });

  const data = await response.json();

  if (data.error) {
    return res.status(500).json({ reply: `APIエラー: ${data.error.message}` });
  }

  res.status(200).json({ reply: data.choices[0].message.content });
}
