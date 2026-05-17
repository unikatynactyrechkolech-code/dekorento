-- =========================================================================
-- DEKORENTO — migrace #2
-- Newsletter, dostupnost, konstrukce, video, velikost
-- Zkopíruj do Supabase → SQL Editor → Run
-- =========================================================================

-- =========================================================================
-- 1. Rozšíření tabulky PRODUCTS
-- =========================================================================
alter table public.products
  add column if not exists size text,                  -- "2,4 × 2,4 m"
  add column if not exists video_url text,             -- YouTube/Vimeo manuál
  add column if not exists requires_construction boolean default true, -- vyžaduje stojan?
  add column if not exists construction_price integer default 500;     -- cena stojanu/den

-- Speciální "doplňkový" produkt — konstrukce/stojan
insert into public.products (slug, name, description, price, stock, image, category, active, requires_construction, construction_price)
values (
  'konstrukce-stojan',
  'Konstrukce / Stojan na pozadí',
  'Hliníková konstrukce 2,5 × 2,5 m pro upevnění libovolného pozadí. Snadná montáž, převoz i instalace.',
  500,
  10,
  null,
  'Příslušenství',
  true,
  false,
  0
)
on conflict (slug) do nothing;

-- =========================================================================
-- 2. NEWSLETTER (zdarma, ukládá se do Supabase)
-- =========================================================================
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  source text default 'web',           -- 'web' | 'checkout' | 'import'
  confirmed boolean default true,      -- single opt-in; lze přepnout na double opt-in
  unsubscribed_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists newsletter_email_idx on public.newsletter_subscribers(email);

alter table public.newsletter_subscribers enable row level security;

-- Veřejné přihlášení (insert) povoleno všem, čtení jen service_role
drop policy if exists "newsletter_insert_public" on public.newsletter_subscribers;
create policy "newsletter_insert_public" on public.newsletter_subscribers
  for insert with check (true);

-- =========================================================================
-- 3. POHLED — DOSTUPNOST PRODUKTŮ V ČASE
-- Spojí stock s rezervacemi z objednávek (rental_from, rental_to)
-- a vrací počet zarezervovaných kusů pro daný produkt a den.
-- =========================================================================
create or replace view public.product_reservations as
select
  p.id as product_id,
  p.slug,
  p.name,
  p.stock as total_stock,
  d::date as date,
  coalesce(sum(oi.quantity), 0)::int as reserved,
  (p.stock - coalesce(sum(oi.quantity), 0))::int as available
from public.products p
cross join generate_series(current_date, current_date + interval '90 days', interval '1 day') d
left join public.order_items oi on oi.product_id = p.id
left join public.orders o on o.id = oi.order_id
  and o.status not in ('cancelled')
  and o.rental_from is not null
  and o.rental_to is not null
  and d::date between o.rental_from and o.rental_to
group by p.id, p.slug, p.name, p.stock, d::date;

grant select on public.product_reservations to anon, authenticated;

-- =========================================================================
-- 4. FUNKCE — kontrola dostupnosti pro konkrétní termín
-- Použití: select * from public.check_availability('2026-06-15', '2026-06-17');
-- =========================================================================
create or replace function public.check_availability(
  p_from date,
  p_to date
)
returns table (
  product_id uuid,
  slug text,
  name text,
  total_stock int,
  max_reserved int,
  available int
) language sql stable as $$
  with day_reservations as (
    select
      p.id,
      p.slug,
      p.name,
      p.stock,
      coalesce(max(daily.reserved), 0) as max_reserved
    from public.products p
    left join (
      select
        oi.product_id,
        d::date as day,
        sum(oi.quantity) as reserved
      from public.order_items oi
      join public.orders o on o.id = oi.order_id
      cross join generate_series(p_from, p_to, interval '1 day') d
      where o.status not in ('cancelled')
        and o.rental_from is not null
        and o.rental_to is not null
        and d::date between o.rental_from and o.rental_to
      group by oi.product_id, d::date
    ) daily on daily.product_id = p.id
    where p.active = true
    group by p.id, p.slug, p.name, p.stock
  )
  select
    id, slug, name, stock, max_reserved::int,
    (stock - max_reserved)::int as available
  from day_reservations;
$$;

grant execute on function public.check_availability(date, date) to anon, authenticated;

-- =========================================================================
-- HOTOVO ✅
-- =========================================================================
