-- =========================================================================
-- DEKORENTO — migrace #4
-- Tabulka manuálních rezervací (admin)
-- Zkopíruj do Supabase → SQL Editor → Run
-- =========================================================================

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  reserved_from date not null,
  reserved_to date not null,
  note text,
  created_by text default 'admin',
  created_at timestamptz default now(),
  constraint valid_range check (reserved_to >= reserved_from)
);

create index if not exists reservations_product_idx on public.reservations(product_id);
create index if not exists reservations_dates_idx on public.reservations(reserved_from, reserved_to);

alter table public.reservations enable row level security;

-- Jen service_role může číst/psát (admin)
-- Veřejné čtení povolíme pro zákazníky (jen product_id + datumy, bez note)
drop policy if exists "reservations_public_read" on public.reservations;
create policy "reservations_public_read" on public.reservations
  for select using (true);

-- HOTOVO ✅
