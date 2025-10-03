-- ============================================
-- PHASE 4: CUSTOM DOMAIN AUTOMATION
-- ============================================

-- Add domain verification and SSL tracking fields to clients table
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS custom_domain text,
ADD COLUMN IF NOT EXISTS domain_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS domain_verification_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS ssl_status text DEFAULT 'pending', -- pending, active, failed
ADD COLUMN IF NOT EXISTS ssl_issued_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS dns_records_status jsonb DEFAULT '{}', -- Track A, CNAME, etc.
ADD COLUMN IF NOT EXISTS last_domain_check timestamp with time zone;

-- Create index for faster domain lookups
CREATE INDEX IF NOT EXISTS idx_clients_custom_domain ON public.clients(custom_domain);
CREATE INDEX IF NOT EXISTS idx_clients_domain_verified ON public.clients(domain_verified);

-- Add unique constraint to ensure one domain per client
ALTER TABLE public.clients
ADD CONSTRAINT unique_custom_domain UNIQUE (custom_domain);

COMMENT ON COLUMN public.clients.custom_domain IS 'Client custom domain (e.g., www.restaurant.com)';
COMMENT ON COLUMN public.clients.domain_verified IS 'Whether DNS records are correctly configured';
COMMENT ON COLUMN public.clients.ssl_status IS 'SSL certificate status: pending, active, failed';
COMMENT ON COLUMN public.clients.dns_records_status IS 'JSON object tracking individual DNS record verification';