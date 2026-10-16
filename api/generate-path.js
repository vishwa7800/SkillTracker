// ==============================================================================
//  api/generate-path.js — Vercel Serverless Function
//  Hides GEMINI_API_KEY on the server so visitors cannot see it in DevTools/Network
// ==============================================================================

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { skillName } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    if (!skillName || typeof skillName !== 'string' || !skillName.trim()) {
      return res.status(400).json({ error: 'Please provide a valid skillName.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in Vercel environment variables.'
      });
    }

    const prompt = `You are an expert learning coach. Create a structured learning path for '${skillName.trim()}'. 
Return exactly 8 sessions or more if it nedded add session according to the skill requires as a JSON array like this:
[{ "session": 1, "title": "...", "description": "...(one line)" }]
No extra text. Only raw JSON.`;

    const fetchHeaders = { 'Content-Type': 'application/json' };
    if (req.headers && req.headers.referer) {
      fetchHeaders['Referer'] = req.headers.referer;
    } else {
      fetchHeaders['Referer'] = 'https://skill-tracker-eosin.vercel.app/';
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: fetchHeaders,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return res.status(response.status).json({
        error: `Gemini API responded with status ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error generating path:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
