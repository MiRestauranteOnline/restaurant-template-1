-- ============================================
-- PHASE 1.1: TEMPLATE MANAGEMENT SYSTEM
-- ============================================

-- Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'development' CHECK (status IN ('development', 'production')),
  description TEXT,
  folder_path TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  client_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on templates
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for templates
CREATE POLICY "Public can view active templates"
  ON public.templates
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all templates"
  ON public.templates
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add template_id to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.templates(id);

-- Insert default template (Modern Restaurant)
INSERT INTO public.templates (name, slug, status, folder_path, description, client_count)
VALUES (
  'Modern Restaurant',
  'modern-restaurant',
  'production',
  'src/templates/modern-restaurant',
  'Elegant and modern restaurant template with dark theme',
  0
)
ON CONFLICT (slug) DO NOTHING;

-- Create function to update template client counts
CREATE OR REPLACE FUNCTION public.update_template_client_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update old template count (if changed)
  IF OLD.template_id IS NOT NULL AND (TG_OP = 'UPDATE' AND OLD.template_id != NEW.template_id OR TG_OP = 'DELETE') THEN
    UPDATE public.templates 
    SET client_count = (
      SELECT COUNT(*) FROM public.clients WHERE template_id = OLD.template_id
    )
    WHERE id = OLD.template_id;
  END IF;
  
  -- Update new template count
  IF NEW.template_id IS NOT NULL AND TG_OP IN ('INSERT', 'UPDATE') THEN
    UPDATE public.templates 
    SET client_count = (
      SELECT COUNT(*) FROM public.clients WHERE template_id = NEW.template_id
    )
    WHERE id = NEW.template_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for template client count updates
DROP TRIGGER IF EXISTS template_client_count_trigger ON public.clients;
CREATE TRIGGER template_client_count_trigger
AFTER INSERT OR UPDATE OF template_id OR DELETE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_template_client_count();

-- Create updated_at trigger for templates
CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PHASE 1.2: USAGE TRACKING & BILLING SYSTEM
-- ============================================

-- Add usage limits to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS monthly_visits_limit INTEGER DEFAULT 3000,
ADD COLUMN IF NOT EXISTS monthly_bandwidth_limit_gb INTEGER DEFAULT 6;

-- Create client_monthly_usage table
CREATE TABLE IF NOT EXISTS public.client_monthly_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- First day of the month (e.g., 2024-03-01)
  total_visits INTEGER DEFAULT 0,
  total_bandwidth_gb NUMERIC DEFAULT 0,
  overage_visits INTEGER DEFAULT 0,
  overage_bandwidth_gb NUMERIC DEFAULT 0,
  overage_charge NUMERIC DEFAULT 0,
  billed BOOLEAN DEFAULT FALSE,
  billing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, month)
);

-- Enable RLS on client_monthly_usage
ALTER TABLE public.client_monthly_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_monthly_usage
CREATE POLICY "Users can view their client usage"
  ON public.client_monthly_usage
  FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM public.user_clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all usage"
  ON public.client_monthly_usage
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert usage data"
  ON public.client_monthly_usage
  FOR INSERT
  WITH CHECK (true); -- Edge functions will insert usage data

CREATE POLICY "System can update usage data"
  ON public.client_monthly_usage
  FOR UPDATE
  USING (true); -- Edge functions will update usage data

-- Create updated_at trigger for client_monthly_usage
CREATE TRIGGER update_client_monthly_usage_updated_at
BEFORE UPDATE ON public.client_monthly_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Comment: Cron jobs will be set up after edge functions are created