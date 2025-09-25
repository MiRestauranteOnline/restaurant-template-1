-- Add primary color field to client_settings table  
ALTER TABLE public.client_settings 
ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#FFD700' CHECK (primary_color ~* '^#[0-9A-F]{6}$');