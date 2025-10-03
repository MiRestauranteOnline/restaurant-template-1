-- Ensure anon/authenticated can SELECT needed tables; rely on RLS for filtering
grant usage on schema public to anon, authenticated;
grant select on table public.user_clients to anon, authenticated;
grant select on table public.menu_items to anon, authenticated;
grant select on table public.menu_categories to anon, authenticated;
grant select on table public.team_members to anon, authenticated;
grant select on table public.reviews to anon, authenticated;
grant select on table public.premium_features to anon, authenticated;