-- ============================================
-- FIX: Public Access to Restaurant Data
-- ============================================

-- Problem: Public visitors can't see menus, reviews, team members
-- Solution: Allow public SELECT on these tables

-- Menu Items: Allow public to view active items
DROP POLICY IF EXISTS "Public can view active menu items" ON public.menu_items;
CREATE POLICY "Public can view active menu items"
  ON public.menu_items
  FOR SELECT
  USING (is_active = true);

-- Menu Categories: Allow public to view active categories
DROP POLICY IF EXISTS "Public can view active menu categories" ON public.menu_categories;
CREATE POLICY "Public can view active menu categories"
  ON public.menu_categories
  FOR SELECT
  USING (is_active = true);

-- Reviews: Allow public to view active reviews
DROP POLICY IF EXISTS "Public can view active reviews" ON public.reviews;
CREATE POLICY "Public can view active reviews"
  ON public.reviews
  FOR SELECT
  USING (is_active = true);

-- Team Members: Allow public to view active team members
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active team members" ON public.team_members;
CREATE POLICY "Public can view active team members"
  ON public.team_members
  FOR SELECT
  USING (is_active = true);

-- Premium Features: Allow public to view (needed for Google Analytics, GSC)
DROP POLICY IF EXISTS "Public can view premium features" ON public.premium_features;
CREATE POLICY "Public can view premium features"
  ON public.premium_features
  FOR SELECT
  USING (true);

-- Note: Admin/user policies for INSERT/UPDATE/DELETE remain unchanged
-- Only SELECT is now public