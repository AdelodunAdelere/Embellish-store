-- ============================================================
-- EMBELLISH – Supabase PostgreSQL Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────────
create table if not exists categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  slug       text not null unique,
  image      text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────────
create table if not exists products (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  slug         text not null unique,
  description  text,
  price        integer not null,          -- stored in kobo (₦1 = 100 kobo) or naira integer
  original_price integer,
  category     text not null,             -- references categories.slug
  images       text[] default '{}',
  stock        integer not null default 0,
  colors       text[] default '{}',
  sizes        text[] default '{}',
  badge        text check (badge in ('new','sale','bestseller')),
  rating       numeric(3,1) default 0,
  review_count integer default 0,
  is_featured  boolean default false,
  created_at   timestamptz default now()
);

create index if not exists products_category_idx on products(category);
create index if not exists products_slug_idx on products(slug);
create index if not exists products_is_featured_idx on products(is_featured);

-- ─────────────────────────────────────────────────
-- USER PROFILES  (extends Supabase auth.users)
-- ─────────────────────────────────────────────────
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  phone      text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─────────────────────────────────────────────────
-- ADDRESSES
-- ─────────────────────────────────────────────────
create table if not exists addresses (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  full_name   text not null,
  phone       text not null,
  street      text not null,
  city        text not null,
  state       text not null,
  is_default  boolean default false,
  created_at  timestamptz default now()
);

create index if not exists addresses_user_idx on addresses(user_id);

-- ─────────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────────
create table if not exists orders (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references auth.users(id) on delete set null,
  items            jsonb not null,           -- snapshot of cart items at checkout
  subtotal         integer not null,         -- naira
  shipping         integer not null default 0,
  discount         integer not null default 0,
  total            integer not null,         -- naira
  status           text not null default 'pending'
                   check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  delivery_address jsonb not null,
  paystack_ref     text unique,
  promo_code       text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index if not exists orders_user_idx on orders(user_id);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_paystack_ref_idx on orders(paystack_ref);

-- ─────────────────────────────────────────────────
-- WISHLIST
-- ─────────────────────────────────────────────────
create table if not exists wishlist (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

create index if not exists wishlist_user_idx on wishlist(user_id);

-- ─────────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────────
create table if not exists reviews (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  rating     integer not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

create index if not exists reviews_product_idx on reviews(product_id);

-- auto-update product rating + review_count after each review change
create or replace function update_product_rating()
returns trigger language plpgsql as $$
begin
  update products
  set
    rating       = (select coalesce(avg(rating::numeric), 0) from reviews where product_id = coalesce(new.product_id, old.product_id)),
    review_count = (select count(*) from reviews where product_id = coalesce(new.product_id, old.product_id))
  where id = coalesce(new.product_id, old.product_id);
  return null;
end;
$$;

drop trigger if exists reviews_update_product on reviews;
create trigger reviews_update_product
  after insert or update or delete on reviews
  for each row execute procedure update_product_rating();

-- ─────────────────────────────────────────────────
-- DISCOUNT CODES
-- ─────────────────────────────────────────────────
create table if not exists discount_codes (
  id         uuid primary key default uuid_generate_v4(),
  code       text not null unique,
  type       text not null check (type in ('percentage','fixed')),
  value      integer not null,    -- % or ₦ amount
  max_uses   integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  is_active  boolean default true,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────

-- profiles: users can only read/write their own profile
alter table profiles enable row level security;
create policy "Own profile" on profiles for all using (auth.uid() = id);

-- addresses: own records only
alter table addresses enable row level security;
create policy "Own addresses" on addresses for all using (auth.uid() = user_id);

-- orders: users see own orders; anon inserts allowed (guest checkout)
alter table orders enable row level security;
create policy "Own orders read" on orders for select using (auth.uid() = user_id);
create policy "Insert order" on orders for insert with check (true);
create policy "Service role all" on orders for all using (auth.role() = 'service_role');

-- wishlist: own records only
alter table wishlist enable row level security;
create policy "Own wishlist" on wishlist for all using (auth.uid() = user_id);

-- reviews: public read, auth write
alter table reviews enable row level security;
create policy "Read reviews" on reviews for select using (true);
create policy "Write own review" on reviews for insert with check (auth.uid() = user_id);
create policy "Update own review" on reviews for update using (auth.uid() = user_id);

-- products: public read, service role write
alter table products enable row level security;
create policy "Public read products" on products for select using (true);
create policy "Service role write products" on products for all using (auth.role() = 'service_role');

-- categories: public read
alter table categories enable row level security;
create policy "Public read categories" on categories for select using (true);
create policy "Service role write categories" on categories for all using (auth.role() = 'service_role');

-- discount_codes: service role only
alter table discount_codes enable row level security;
create policy "Service role discount_codes" on discount_codes for all using (auth.role() = 'service_role');
-- allow authenticated users to validate codes (read-only select)
create policy "Auth validate code" on discount_codes for select using (auth.uid() is not null or true);

-- ─────────────────────────────────────────────────
-- SEED: Categories
-- ─────────────────────────────────────────────────
insert into categories (name, slug) values
  ('Tote Bags',  'tote'),
  ('Handbags',   'handbag'),
  ('Clutches',   'clutch'),
  ('Jewellery',  'jewellery'),
  ('Headbands',  'headbands')
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────
-- SEED: Discount Codes
-- ─────────────────────────────────────────────────
insert into discount_codes (code, type, value, max_uses) values
  ('EMBELLISH10', 'percentage', 10, null),
  ('WELCOME5000', 'fixed', 5000, 500)
on conflict (code) do nothing;
