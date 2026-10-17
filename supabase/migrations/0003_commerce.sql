-- 1. Transactions table updates
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid()
);
alter table public.transactions
  add column if not exists invoice_number text unique,
  add column if not exists payment_method text,
  add column if not exists paid_at timestamptz,
  add column if not exists payment_reference text;

-- 2. Schools table updates
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid()
);
alter table public.schools
  add column if not exists seats_allocated integer not null default 0 check (seats_allocated >= 0);

-- 3. School subscription orders
create table if not exists public.school_subscription_orders (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  requested_plan text not null check (requested_plan in ('basic','pro','enterprise')),
  requested_seats integer not null check (requested_seats > 0),
  status text not null default 'pending' check (status in ('pending','approved','declined')),
  created_at timestamptz not null default now()
);

-- 4. Training requests table & updates
create table if not exists public.training_requests (
  id uuid primary key default gen_random_uuid()
);
alter table public.training_requests
  add column if not exists estimated_amount_dzd numeric(14,2) not null default 0,
  add column if not exists quote_amount_dzd numeric(14,2),
  add column if not exists program_type text not null default 'custom';

-- 5. Teacher payout profiles & requests
create table if not exists public.teacher_payout_profiles (
  teacher_id uuid primary key references public.profiles(id) on delete cascade,
  payout_method text not null check (payout_method in ('bank_transfer','baridimob','paypal')),
  account_holder text not null,
  account_reference text not null,
  bank_name text,
  updated_at timestamptz not null default now()
);

create table if not exists public.teacher_payout_requests (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  amount_dzd numeric(14,2) not null check (amount_dzd > 0),
  status text not null default 'pending' check (status in ('pending','approved','paid','rejected')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  payout_reference text
);

-- 6. Indexes
create index if not exists idx_payout_requests_teacher on public.teacher_payout_requests(teacher_id, requested_at desc);
create index if not exists idx_transactions_invoice on public.transactions(invoice_number);