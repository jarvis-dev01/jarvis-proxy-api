export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id in query' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks?user_id=eq.${user_id}&order=timestamp.desc`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Supabase GET error:", data);
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("💥 Unexpected GET error:", err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
