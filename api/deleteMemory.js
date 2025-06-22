export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID is required' });
  }

  const url = `${process.env.SUPABASE_URL}/rest/v1/memories?id=eq.${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    return res.status(500).json({ success: false, message: error.message || 'Delete failed' });
  }

  return res.status(200).json({ success: true, message: 'Memory deleted' });
}
