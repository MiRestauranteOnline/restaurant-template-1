-- Create FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active FAQs"
  ON public.faqs
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all FAQs"
  ON public.faqs
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can manage their client FAQs"
  ON public.faqs
  FOR ALL
  USING (client_id IN (
    SELECT client_id FROM user_clients WHERE user_id = auth.uid()
  ));

-- Create index for better performance
CREATE INDEX idx_faqs_client_id ON public.faqs(client_id);
CREATE INDEX idx_faqs_display_order ON public.faqs(display_order);

-- Add updated_at trigger
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();