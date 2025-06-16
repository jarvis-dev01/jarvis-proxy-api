export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = {};
  try {
    body = req.body || {};
  } catch (err) {
    console.error("❌ Body parse error:", err);
    return res.status(400).json({ error: 'Invalid JSON input' });
  }

  const { title, user_id } = body;

  if (!title) {
    return res.status(400).json({ error: 'Missing task title' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("❌ Missing Supabase env variables");
    return res.status(500).json({ error: 'Supabase environment variables missing' });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ title, user_id })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Supabase responded with error:", data);
      return res.status(response.status).json({ error: data });
    }

    console.log("✅ Task successfully created:", data);
    return res.status(201).json(data);
  } catch (err) {
    console.error("💥 Unexpected error:", err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
