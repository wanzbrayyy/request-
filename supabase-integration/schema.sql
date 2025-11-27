-- Enable extension for gen_random_uuid()
create extension if not exists "pgcrypto";

-- Messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  username text,
  content text not null,
  link text,
  metadata jsonb,
  location jsonb,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.messages enable row level security;

-- Public read policy (allow anyone to select)
create policy "Public read" on public.messages for select using (true);

-- Allow authenticated users to insert messages where user_id equals auth.uid()
create policy "Insert own" on public.messages for insert using (auth.role() = 'authenticated') with check (auth.uid() = user_id);

-- Allow owners to update/delete their messages
create policy "Update own" on public.messages for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Delete own" on public.messages for delete using (auth.uid() = user_id);