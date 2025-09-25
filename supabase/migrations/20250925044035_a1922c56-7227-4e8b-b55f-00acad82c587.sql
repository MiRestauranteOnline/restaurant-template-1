-- Add new fields to menu_items table for image display options and homepage display
ALTER TABLE menu_items 
ADD COLUMN show_image_home BOOLEAN DEFAULT false,
ADD COLUMN show_image_menu BOOLEAN DEFAULT true,
ADD COLUMN show_on_homepage BOOLEAN DEFAULT false;

-- Create menu_categories table for dynamic category management
CREATE TABLE public.menu_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, name)
);

-- Enable RLS on menu_categories
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_categories
CREATE POLICY "Public can view active menu categories" 
ON public.menu_categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can view their client menu categories" 
ON public.menu_categories 
FOR SELECT 
USING (client_id IN (
  SELECT user_clients.client_id
  FROM user_clients
  WHERE user_clients.user_id = auth.uid()
));

CREATE POLICY "Users can insert their client menu categories" 
ON public.menu_categories 
FOR INSERT 
WITH CHECK (client_id IN (
  SELECT user_clients.client_id
  FROM user_clients
  WHERE user_clients.user_id = auth.uid()
));

CREATE POLICY "Users can update their client menu categories" 
ON public.menu_categories 
FOR UPDATE 
USING (client_id IN (
  SELECT user_clients.client_id
  FROM user_clients
  WHERE user_clients.user_id = auth.uid()
));

CREATE POLICY "Users can delete their client menu categories" 
ON public.menu_categories 
FOR DELETE 
USING (client_id IN (
  SELECT user_clients.client_id
  FROM user_clients
  WHERE user_clients.user_id = auth.uid()
));

-- Add trigger for updated_at on menu_categories
CREATE TRIGGER update_menu_categories_updated_at
BEFORE UPDATE ON public.menu_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories for existing demo client
INSERT INTO public.menu_categories (client_id, name, display_order)
SELECT id, 'Especialidad', 1 FROM clients WHERE subdomain = 'demo'
UNION ALL
SELECT id, 'Plato Principal', 2 FROM clients WHERE subdomain = 'demo'
UNION ALL  
SELECT id, 'Mariscos', 3 FROM clients WHERE subdomain = 'demo'
UNION ALL
SELECT id, 'Postre', 4 FROM clients WHERE subdomain = 'demo';