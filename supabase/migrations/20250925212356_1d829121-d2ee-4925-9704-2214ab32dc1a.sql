-- Add missing stats item columns for generic stats system
ALTER TABLE public.admin_content 
ADD COLUMN IF NOT EXISTS stats_item1_label text DEFAULT 'Años de Experiencia',
ADD COLUMN IF NOT EXISTS stats_item1_number text DEFAULT '15+',
ADD COLUMN IF NOT EXISTS stats_item2_label text DEFAULT 'Clientes Felices', 
ADD COLUMN IF NOT EXISTS stats_item2_number text DEFAULT '5K+',
ADD COLUMN IF NOT EXISTS stats_item3_label text DEFAULT 'Reconocimientos',
ADD COLUMN IF NOT EXISTS stats_item3_number text DEFAULT '10+';