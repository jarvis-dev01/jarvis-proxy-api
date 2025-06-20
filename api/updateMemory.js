import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, title, category, content } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID is required' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const updates = {};
  if (title !== undefined && title !== null) updates.title = title;
  if (category !== undefined && category !== null) updates.category = category;
  if (content !== undefined && content !== null) updates.content = content;

  // 自動で updated_at を更新（任意）
  updates.updated_at = new Date().toISOString();

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update' });
  }

  const { error } = await supabase
    .from('memories')
    .update(updates)
    .eq('id', id);

  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

  return res.status(200).json({ success: true, message: 'Memory updated' });
}
