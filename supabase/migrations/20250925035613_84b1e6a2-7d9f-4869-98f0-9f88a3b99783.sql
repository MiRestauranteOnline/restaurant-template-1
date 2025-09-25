-- Create storage bucket for client images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-assets', 'client-assets', true);

-- Create RLS policies for client assets
CREATE POLICY "Anyone can view client assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'client-assets');

CREATE POLICY "Authenticated users can upload client assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'client-assets' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their client assets" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'client-assets' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their client assets" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'client-assets' AND 
  auth.uid() IS NOT NULL
);