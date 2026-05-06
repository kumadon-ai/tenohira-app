exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: null, error: 'API key not set' })
    };
  }

  const { message, history, location } = JSON.parse(event.body || '{}');

  const system = `あなたは生活支援AIアシスタント「マイティ」です。
ユーザーの現在地は「${location || '不明'}」です。
やさしく簡潔に日本語で答えてください（150字以内）。
施設を探す場合は「近くの〇〇はGoogleマップで検索できます」と案内してください。
緊急時は119番・110番を案内してください。`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages: [
          { role: 'system', content: system },
          ...(history || []).slice(-8),
          { role: 'user', content: message }
        ]
      })
    });
    const d = await res.json();
    const ans = d.choices?.[0]?.message?.content;
    if (ans) {
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: ans, model: 'gpt-4o-mini' })
      };
    }
    throw new Error(JSON.stringify(d));
  } catch(e) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: null, error: e.message })
    };
  }
};
