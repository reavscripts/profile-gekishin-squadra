# profile.reav.space — Template Profile Builder

Editor online per compilare template (PNG) e generare:
- Download PNG
- Link condivisibile `https://profile.reav.space/p/<id>`

## Requisiti
- Node 18+ (consigliato 20)
- Un progetto Supabase

## Setup Supabase
1) Crea bucket Storage: `profile-images` (Public)
2) Crea tabella `profiles`:

```sql
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  template_id text not null,
  image_path text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are publicly readable"
on public.profiles for select
to anon
using (true);

create policy "profiles are insertable by anyone"
on public.profiles for insert
to anon
with check (true);
```

> Nota: inserimento pubblico = possibile spam. Quando vuoi, lo spostiamo su API route con rate limit.

## Avvio locale
```bash
npm i
cp .env.example .env.local
npm run dev
```

Apri: http://localhost:3000

## Debug coordinate
Nella pagina editor trovi un toggle **Debug**:
- puoi trascinare e ridimensionare le box
- premi **Copy config** per ottenere il JSON aggiornato (da incollare in `lib/templateConfig.ts`)
