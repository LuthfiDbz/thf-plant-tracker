-- ============================================================
-- Plant Tracker - Supabase schema
-- Run this in the Supabase SQL editor for a new project.
-- ============================================================

-- Required for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. plants (master data, shared across all authenticated users)
-- ------------------------------------------------------------
create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  estimated_harvest_days integer not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.plants enable row level security;

-- Any signed-in user can read the shared plant catalog
create policy "plants_select_authenticated"
  on public.plants for select
  to authenticated
  using (true);

-- Any signed-in user can add/edit/delete master plant entries
create policy "plants_insert_authenticated"
  on public.plants for insert
  to authenticated
  with check (true);

create policy "plants_update_authenticated"
  on public.plants for update
  to authenticated
  using (true)
  with check (true);

create policy "plants_delete_authenticated"
  on public.plants for delete
  to authenticated
  using (true);

-- ------------------------------------------------------------
-- 2. plant_logs (per-user tracking log, unified for soil & hydro)
-- ------------------------------------------------------------
create table if not exists public.plant_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plant_id uuid not null references public.plants (id) on delete cascade,
  method_id smallint not null check (method_id in (1, 2)), -- 1 = Soil, 2 = Hydroponic
  status text not null check (status in ('Seedling', 'Planting', 'Harvested')),
  plant_date date not null,
  harvest_date date not null,
  harvest_status text not null default 'Progress'
    check (harvest_status in ('Progress', 'On time', 'Outdated', 'Early')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists plant_logs_user_method_idx
  on public.plant_logs (user_id, method_id, plant_date desc);

alter table public.plant_logs enable row level security;

-- Users can only see and manage their own logs
create policy "plant_logs_select_own"
  on public.plant_logs for select
  to authenticated
  using (auth.uid() = user_id);

create policy "plant_logs_insert_own"
  on public.plant_logs for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "plant_logs_update_own"
  on public.plant_logs for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "plant_logs_delete_own"
  on public.plant_logs for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 3. Storage bucket for plant images
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('plant-images', 'plant-images', true)
on conflict (id) do nothing;

-- Anyone can view images (bucket is public)
create policy "plant_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'plant-images');

-- Signed-in users can upload images
create policy "plant_images_authenticated_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'plant-images');

-- Signed-in users can update/delete images (kept simple: any authenticated user)
create policy "plant_images_authenticated_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'plant-images');

create policy "plant_images_authenticated_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'plant-images');
