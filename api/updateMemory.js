export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, title, category, content } = req.body || {};

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID is required' });
  }

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (category !== undefined) updates.category = category;
  if (content !== undefined) updates.content = content;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update' });
  }

  const url = `${process.env.SUPABASE_URL}/rest/v1/memories?id=eq.${id}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(updates),
  });

  const result = await response.json();

  if (!response.ok) {
    return res.status(500).json({ success: false, message: result.message || 'Update failed' });
  }

  return res.status(200).json({ success: true, message: 'Memory updated', data: result });
}
