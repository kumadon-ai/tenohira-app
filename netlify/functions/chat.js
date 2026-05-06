exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { message, history, location } = JSON.parse(event.body || '{}');

  const system = `あなたは生活支援AIアシスタント「マイティ」です。
ユーザーの現在地は「${location || '不明'}」です。
やさしく簡潔に日本語で答えてください（150字以内）。
施設を探す場合は「近くの〇〇はGoogleマップで検索できます」と案内してください。
緊急時は119番・110番を案内してください。`;

  const messages = [
    ...(history || []).slice(-8),
    { role: 'user', content: message }
  ];

  // Claude API
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system,
        messages
      })
    });
    const d = await res.json();
    const ans = d.content?.[0]?.text;
    if (ans) return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ answer: ans, model: 'claude' })
    };
  } catch {}

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ answer: null })
  };
};
