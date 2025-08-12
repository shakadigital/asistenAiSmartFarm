-- Tabel laporan harian produksi unggas
create table if not exists public.daily_reports (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  flock text not null,
  dead integer not null default 0,
  eggs integer not null default 0,
  feed_kg numeric not null default 0,
  weight_kg numeric not null default 0,
  created_at timestamptz not null default now(),
  user_id uuid default auth.uid()
) ;

-- Index untuk query cepat berdasarkan tanggal
create index if not exists daily_reports_date_idx on public.daily_reports(date desc);

-- Policy RLS
alter table public.daily_reports enable row level security;

create policy if not exists "Allow read own reports"
  on public.daily_reports for select
  using (auth.uid() = user_id);

create policy if not exists "Allow insert own reports"
  on public.daily_reports for insert
  with check (auth.uid() = user_id);