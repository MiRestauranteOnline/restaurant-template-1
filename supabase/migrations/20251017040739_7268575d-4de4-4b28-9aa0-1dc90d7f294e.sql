-- Add title_size_scale field to client_settings table
-- Stores percentage adjustment for all h1/h2 titles: -50, -25, -10, 0, 10, 25, 50
-- Default is 0 (no scaling)
ALTER TABLE public.client_settings
ADD COLUMN title_size_scale integer DEFAULT 0 CHECK (title_size_scale IN (-50, -25, -10, 0, 10, 25, 50));