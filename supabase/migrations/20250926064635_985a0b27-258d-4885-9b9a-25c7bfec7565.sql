-- Add category_id column to menu_items table
ALTER TABLE public.menu_items ADD COLUMN category_id UUID;

-- Add foreign key constraint
ALTER TABLE public.menu_items ADD CONSTRAINT fk_menu_items_category_id 
FOREIGN KEY (category_id) REFERENCES public.menu_categories(id) ON DELETE SET NULL;

-- Migrate existing data by matching category names to IDs
UPDATE public.menu_items 
SET category_id = (
  SELECT mc.id 
  FROM public.menu_categories mc 
  WHERE mc.name = menu_items.category 
  AND mc.client_id = menu_items.client_id
);

-- Add index for better performance
CREATE INDEX idx_menu_items_category_id ON public.menu_items(category_id);