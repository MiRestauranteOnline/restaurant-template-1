-- Add razón social and RUC fields to clients table
ALTER TABLE public.clients
ADD COLUMN razon_social text DEFAULT 'Mi Restaurante Online',
ADD COLUMN ruc text DEFAULT '20123456789';