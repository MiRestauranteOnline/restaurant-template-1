-- Add keywords field to page_metadata table
ALTER TABLE public.page_metadata 
ADD COLUMN keywords text;

COMMENT ON COLUMN public.page_metadata.keywords IS 'Comma-separated list of keywords for the page (note: largely ignored by modern search engines like Google)';