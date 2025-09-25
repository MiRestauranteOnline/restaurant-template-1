-- Create clients table for restaurant client data
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subdomain TEXT NOT NULL UNIQUE,
  restaurant_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  address TEXT,
  coordinates JSONB,
  opening_hours JSONB DEFAULT '{}',
  social_media_links JSONB DEFAULT '{}',
  brand_colors JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_items table for client restaurant menus
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_settings table for customizable client settings
CREATE TABLE public.client_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE UNIQUE,
  whatsapp_messages JSONB DEFAULT '{}',
  delivery_info JSONB DEFAULT '{}',
  other_customizations JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_clients table to link users to their client accounts
CREATE TABLE public.user_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, client_id)
);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients table
CREATE POLICY "Users can view their own clients" 
ON public.clients 
FOR SELECT 
USING (
  id IN (
    SELECT client_id FROM public.user_clients 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own clients" 
ON public.clients 
FOR UPDATE 
USING (
  id IN (
    SELECT client_id FROM public.user_clients 
    WHERE user_id = auth.uid()
  )
);

-- RLS Policies for menu_items table
CREATE POLICY "Users can view their client menu items" 
ON public.menu_items 
FOR SELECT 
USING (
  client_id IN (
    SELECT client_id FROM public.user_clients 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their client menu items" 
ON public.menu_items 
FOR INSERT 
WITH CHECK (
  client_id IN (
    SELECT client_id FROM public.user_clients 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their client menu items" 
ON public.menu_items 
FOR UPDATE 
USING (
  client_id IN (
    SELECT client_id FROM public.user_clients 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their client menu items" 
ON public.menu_items 
FOR DELETE 
USING (
  client_id IN (
    SELECT client_id FROM public.user_clients 
    WHERE user_id = auth.uid()
  )
);

-- RLS Policies for client_settings table
CREATE POLICY "Users can view their client settings" 
ON public.client_settings 
FOR SELECT 
USING (
  client_id IN (
    SELECT client_id FROM public.user_clients 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their client settings" 
ON public.client_settings 
FOR INSERT 
WITH CHECK (
  client_id IN (
    SELECT client_id FROM public.user_clients 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their client settings" 
ON public.client_settings 
FOR UPDATE 
USING (
  client_id IN (
    SELECT client_id FROM public.user_clients 
    WHERE user_id = auth.uid()
  )
);

-- RLS Policies for user_clients table
CREATE POLICY "Users can view their own client relationships" 
ON public.user_clients 
FOR SELECT 
USING (user_id = auth.uid());

-- Public access policies for client websites (so visitors can see restaurant data)
CREATE POLICY "Public can view active clients by subdomain" 
ON public.clients 
FOR SELECT 
USING (true);

CREATE POLICY "Public can view active menu items" 
ON public.menu_items 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can view client settings" 
ON public.client_settings 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_clients_subdomain ON public.clients(subdomain);
CREATE INDEX idx_menu_items_client_id ON public.menu_items(client_id);
CREATE INDEX idx_menu_items_category ON public.menu_items(category);
CREATE INDEX idx_client_settings_client_id ON public.client_settings(client_id);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_settings_updated_at
BEFORE UPDATE ON public.client_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();