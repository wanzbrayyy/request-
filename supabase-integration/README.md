````markdown
```markdown
# Supabase integration (messages, realtime)

Repositori ini menambahkan contoh integrasi Supabase langsung dari klien (tanpa backend khusus) untuk menyimpan dan menerima pesan secara real-time.

Yang saya tambahkan:

- supabase-integration/schema.sql — skrip SQL untuk membuat tabel `messages` dan kebijakan RLS.
- supabase-integration/supabaseClient.js — helper untuk membuat dan mengekspor supabase client.
- supabase-integration/messages.js — helper untuk auth (signin/signout), mengirim pesan, mengambil pesan, dan subscribe realtime.
- supabase-integration/.env.example — contoh variabel lingkungan.

Penting: JANGAN commit secret (sb_secret_...) ke repo. Gunakan hanya publishable/anon key pada klien (NEXT_PUBLIC_SUPABASE_ANON_KEY). Jika Anda mengunggah secret key, segera rotate di dashboard Supabase.

Setup

1. Di Supabase Dashboard > SQL Editor, jalankan `supabase-integration/schema.sql` untuk membuat tabel dan kebijakan.
2. Di Settings > API, salin "Project URL" dan "anon public" key (atau publishable key). Isi variabel lingkungan di file `.env.local` atau environment provider Anda:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

3. Install dependency pada project Anda (contoh menggunakan npm):

```bash
npm install @supabase/supabase-js
```

4. Contoh pemakaian (React / browser):

```js
import { signInWithEmail, sendMessage, fetchRecentMessages, subscribeToMessages } from './supabase-integration/messages';

// sign in
await signInWithEmail('you@example.com');

// fetch messages
const messages = await fetchRecentMessages();

// send message
await sendMessage({ content: 'Halo dari Supabase', link: 'https://example.com', metadata: { tags: ['chat'] }, location: { lat: -6.2, lng: 106.8 } });

// realtime subscribe
const channel = subscribeToMessages((row) => {
  console.log('New message', row);
});

// to unsubscribe
// channel.unsubscribe();
```

Keamanan & RLS

- Script SQL mengaktifkan Row Level Security dan menambahkan kebijakan dasar: semua orang dapat membaca (select), tetapi hanya pengguna yang terotentikasi dengan `auth.uid()` yang sama dengan `user_id` boleh membuat, mengubah, atau menghapus pesannya sendiri.
- Jika Anda membutuhkan akses publik menulis (chat anonymous), sesuaikan kebijakan RLS sesuai kebutuhan.

Jika Anda ingin saya menyesuaikan integrasi ini (mis. menambahkan kolom tambahan, webhook, file upload ke Storage, atau membuat contoh UI React), beri tahu saya dan saya akan tambahkan.
```
````
