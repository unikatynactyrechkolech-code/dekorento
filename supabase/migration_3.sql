-- =========================================================================
-- DEKORENTO — migrace #3
-- Přidá sloupce material, stojan, doprava do tabulky products
-- Zkopíruj do Supabase → SQL Editor → Run
-- =========================================================================

alter table public.products
  add column if not exists material text,   -- "100% polyester", "bavlna"…
  add column if not exists stojan text,     -- "Volitelně za 500 Kč / den"
  add column if not exists doprava text;    -- "Praha + okolí, ČR po dohodě"

-- HOTOVO ✅
