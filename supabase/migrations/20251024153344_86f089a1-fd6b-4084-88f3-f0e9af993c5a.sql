-- Create reclamaciones table to store customer claims
CREATE TABLE IF NOT EXISTS public.reclamaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  claim_code TEXT NOT NULL UNIQUE,
  
  -- Personal/Business Info
  person_type TEXT NOT NULL CHECK (person_type IN ('natural', 'juridica')),
  dni TEXT,
  ruc TEXT,
  business_name TEXT,
  full_name TEXT NOT NULL,
  
  -- Contact Info
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  
  -- Purchase Details
  purchase_amount NUMERIC,
  product_description TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  
  -- Claim Details
  claim_type TEXT NOT NULL CHECK (claim_type IN ('reclamo', 'queja')),
  description TEXT NOT NULL,
  
  -- Metadata
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reclamaciones ENABLE ROW LEVEL SECURITY;

-- Admins can view all claims
CREATE POLICY "Admins can view all reclamaciones"
  ON public.reclamaciones FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all claims
CREATE POLICY "Admins can manage all reclamaciones"
  ON public.reclamaciones FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their client's claims
CREATE POLICY "Users can view their client reclamaciones"
  ON public.reclamaciones FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM public.user_clients WHERE user_id = auth.uid()
    )
  );

-- Public can insert claims (no auth required)
CREATE POLICY "Public can submit reclamaciones"
  ON public.reclamaciones FOR INSERT
  WITH CHECK (true);

-- Add index for faster lookups
CREATE INDEX idx_reclamaciones_client_id ON public.reclamaciones(client_id);
CREATE INDEX idx_reclamaciones_claim_code ON public.reclamaciones(claim_code);
CREATE INDEX idx_reclamaciones_status ON public.reclamaciones(status);

-- Add trigger for updated_at
CREATE TRIGGER update_reclamaciones_updated_at
  BEFORE UPDATE ON public.reclamaciones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();