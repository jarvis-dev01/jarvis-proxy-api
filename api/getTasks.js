export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Missing Supabase environment variables' });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks?select=*`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data || 'Unknown error' });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
