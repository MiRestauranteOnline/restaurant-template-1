-- Rename domain column back to subdomain in clients table
ALTER TABLE public.clients RENAME COLUMN domain TO subdomain;