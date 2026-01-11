
-- 1. Tables
create table public.lobbies (
  id text primary key,
  status text not null check (status in ('LOBBY', 'PLAYING', 'FINISHED')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  host_id uuid references auth.users(id)
);

create table public.games (
  id uuid default gen_random_uuid() primary key,
  lobby_id text references public.lobbies(id),
  game_state jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.players (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id), -- Optional link to auth user
  lobby_id text references public.lobbies(id),
  name text not null,
  token text,
  money int default 0,
  is_winner boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Indexes for faster lookups
create index idx_lobbies_status on public.lobbies(status);
create index idx_games_lobby_id on public.games(lobby_id);
create index idx_players_lobby_id on public.players(lobby_id);

-- 3. RLS Policies (Basic)
alter table public.lobbies enable row level security;
alter table public.games enable row level security;
alter table public.players enable row level security;

-- Allow public read for now
create policy "Public lobbies are viewable by everyone." on public.lobbies for select using (true);
create policy "Public games are viewable by everyone." on public.games for select using (true);

-- Allow public write (INSERT/UPDATE) so the Server can manage games even with Anon Key
-- Note: In production, use Service Role Key and remove these policies!
create policy "Public lobbies are insertable" on public.lobbies for insert with check (true);
create policy "Public lobbies are updatable" on public.lobbies for update using (true);

create policy "Public games are insertable" on public.games for insert with check (true);
create policy "Public games are updatable" on public.games for update using (true);

create policy "Public players are insertable" on public.players for insert with check (true);
create policy "Public players are updatable" on public.players for update using (true);
