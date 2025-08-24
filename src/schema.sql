-- schema.sql

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles: users can select their row"
on profiles for select
using (auth.uid() = id);

create policy "Profiles: users can insert their row"
on profiles for insert
with check (auth.uid() = id);
