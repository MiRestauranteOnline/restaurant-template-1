-- Add favicon_url column to clients table
ALTER TABLE public.clients 
ADD COLUMN favicon_url text;

COMMENT ON COLUMN public.clients.favicon_url IS 'URL to the client favicon image (PNG, ICO, or SVG recommended)';
