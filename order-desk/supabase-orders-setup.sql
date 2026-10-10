-- Run once in Supabase SQL Editor to enable private order sync.
-- This is tied to the existing SoukLink owner account; never add a secret key to the website.

create table if not exists public.order_desk_orders (
  order_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  order_data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.order_desk_orders enable row level security;
revoke all on public.order_desk_orders from anon, public;
grant select, insert, update, delete on public.order_desk_orders to authenticated;

drop policy if exists "Owner can view order desk data" on public.order_desk_orders;
create policy "Owner can view order desk data"
  on public.order_desk_orders for select to authenticated
  using ((select auth.uid()) = '5fa6fa95-8faf-465a-8ad7-7eea347e3026'::uuid and user_id = (select auth.uid()));

drop policy if exists "Owner can add order desk data" on public.order_desk_orders;
create policy "Owner can add order desk data"
  on public.order_desk_orders for insert to authenticated
  with check ((select auth.uid()) = '5fa6fa95-8faf-465a-8ad7-7eea347e3026'::uuid and user_id = (select auth.uid()));

drop policy if exists "Owner can update order desk data" on public.order_desk_orders;
create policy "Owner can update order desk data"
  on public.order_desk_orders for update to authenticated
  using ((select auth.uid()) = '5fa6fa95-8faf-465a-8ad7-7eea347e3026'::uuid and user_id = (select auth.uid()))
  with check ((select auth.uid()) = '5fa6fa95-8faf-465a-8ad7-7eea347e3026'::uuid and user_id = (select auth.uid()));

drop policy if exists "Owner can delete order desk data" on public.order_desk_orders;
create policy "Owner can delete order desk data"
  on public.order_desk_orders for delete to authenticated
  using ((select auth.uid()) = '5fa6fa95-8faf-465a-8ad7-7eea347e3026'::uuid and user_id = (select auth.uid()));
