-- Update function to delete cached pre-renders instead of calling edge function
CREATE OR REPLACE FUNCTION public.trigger_prerender_regeneration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $$
DECLARE
  client_subdomain TEXT;
  files_deleted INTEGER := 0;
BEGIN
  -- Get the subdomain for the affected client
  IF TG_TABLE_NAME = 'clients' THEN
    client_subdomain := COALESCE(NEW.subdomain, OLD.subdomain);
  ELSE
    SELECT c.subdomain INTO client_subdomain
    FROM public.clients c
    WHERE c.id = COALESCE(NEW.client_id, OLD.client_id);
  END IF;

  IF client_subdomain IS NOT NULL THEN
    BEGIN
      -- Delete all cached pre-renders for this client
      -- This forces fresh generation on next bot visit
      DELETE FROM storage.objects
      WHERE bucket_id = 'client-assets'
        AND name LIKE ('prerenders/' || client_subdomain || '%');
      
      GET DIAGNOSTICS files_deleted = ROW_COUNT;
      RAISE NOTICE 'Deleted % cached pre-renders for domain %', files_deleted, client_subdomain;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Failed to delete pre-renders for domain %: %', client_subdomain, SQLERRM;
    END;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;