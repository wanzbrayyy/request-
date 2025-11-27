import { supabase } from './supabaseClient';

/**
 * Sign in with magic link (email)
 */
export async function signInWithEmail(email) {
  return supabase.auth.signInWithOtp({ email });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function fetchRecentMessages(limit = 100) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function sendMessage({ content, link = null, metadata = null, location = null }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const payload = {
    user_id: user.id,
    username: user.user_metadata?.full_name || user.email || user.id,
    content,
    link,
    metadata,
    location
  };

  const { data, error } = await supabase.from('messages').insert([payload]).select();
  if (error) throw error;
  return data[0];
}

/**
 * Subscribe to realtime inserts on messages table.
 * callback will be called with the new row.
 * Returns the channel; call channel.unsubscribe() to stop.
 */
export function subscribeToMessages(callback) {
  const channel = supabase
    .channel('public:messages')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
}