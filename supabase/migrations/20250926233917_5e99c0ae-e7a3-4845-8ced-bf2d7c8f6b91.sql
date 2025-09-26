-- Add domain field to clients table for custom domain support
ALTER TABLE public.clients ADD COLUMN domain text UNIQUE;

-- Add index for better performance on domain lookups
CREATE INDEX idx_clients_domain ON public.clients(domain) WHERE domain IS NOT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.clients.domain IS 'Custom domain for clients (e.g., restaurantname.com). Either domain OR subdomain should be populated, not both.';