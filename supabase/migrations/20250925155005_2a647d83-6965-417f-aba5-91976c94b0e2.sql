-- Add theme field to clients table
ALTER TABLE public.clients 
ADD COLUMN theme text DEFAULT 'dark' CHECK (theme IN ('dark', 'bright'));

-- Set the demo client to bright theme for testing
UPDATE public.clients 
SET theme = 'bright' 
WHERE subdomain = 'demos';