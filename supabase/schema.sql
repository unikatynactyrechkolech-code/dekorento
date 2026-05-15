-- =========================================================================
-- DEKORENTO — kompletní schéma databáze
-- Zkopíruj celý tento soubor do Supabase → SQL Editor → Run
-- =========================================================================

-- Pomocná funkce: aktualizace updated_at sloupce
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- =========================================================================
-- 1. PROFILES — rozšíření auth.users
-- =========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  street text,
  city text,
  postal_code text,
  country text default 'CZ',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-vytvoření profilu po registraci
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- 2. CATEGORIES
-- =========================================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- =========================================================================
-- 3. PRODUCTS
-- =========================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price integer not null check (price >= 0),  -- v halířích nebo celých Kč (sjednoceno na Kč)
  stock integer not null default 0,
  in_stock boolean generated always as (stock > 0) stored,
  image text,                  -- hlavní obrázek
  images text[] default '{}',  -- galerie
  category_id uuid references public.categories(id) on delete set null,
  category text,               -- denormalizovaná kategorie pro rychlé filtrování
  tags text[] default '{}',
  badge text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_active_idx on public.products(active);

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 4. ORDERS
-- =========================================================================
create type order_status as enum ('pending', 'paid', 'confirmed', 'shipped', 'completed', 'cancelled');

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default ('DEK-' || to_char(now(), 'YYYYMMDD') || '-' || lpad((floor(random()*10000))::text, 4, '0')),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  full_name text not null,
  phone text,
  street text,
  city text,
  postal_code text,
  country text default 'CZ',
  note text,
  total integer not null check (total >= 0),
  status order_status default 'pending',
  payment_method text,        -- 'stripe' | 'gopay' | 'bank' | 'cod'
  payment_id text,            -- ID transakce z platebního systému
  rental_from date,           -- pro půjčovnu — datum od
  rental_to date,             -- datum do
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at desc);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 5. ORDER_ITEMS
-- =========================================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,   -- snapshot názvu
  product_slug text,
  product_image text,
  unit_price integer not null,  -- snapshot ceny v době nákupu
  quantity integer not null check (quantity > 0),
  subtotal integer generated always as (unit_price * quantity) stored,
  created_at timestamptz default now()
);

create index if not exists order_items_order_idx on public.order_items(order_id);

-- =========================================================================
-- 6. CART (pro přihlášené uživatele)
-- =========================================================================
create table if not exists public.cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, product_id)
);

create index if not exists cart_user_idx on public.cart(user_id);

create trigger cart_updated_at
  before update on public.cart
  for each row execute function public.set_updated_at();

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================

-- PROFILES: každý vidí/upravuje jen svůj profil
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- CATEGORIES: čtení pro všechny, zápis jen service_role (admin)
alter table public.categories enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (true);

-- PRODUCTS: čtení pro všechny (jen aktivní), zápis přes service_role
alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (active = true);

-- ORDERS: uživatel vidí jen své objednávky, hosté přes service_role
alter table public.orders enable row level security;

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

-- ORDER_ITEMS: viditelné jen vlastníkovi objednávky
alter table public.order_items enable row level security;

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

drop policy if exists "order_items_insert_own" on public.order_items;
create policy "order_items_insert_own" on public.order_items
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or o.user_id is null))
  );

-- CART: každý vidí/upravuje jen svůj košík
alter table public.cart enable row level security;

drop policy if exists "cart_all_own" on public.cart;
create policy "cart_all_own" on public.cart
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- HOTOVO ✅
-- service_role klíč obchází všechny RLS politiky — admin rozhraní
-- volá DB přes service_role, takže má plný přístup.
-- =========================================================================
