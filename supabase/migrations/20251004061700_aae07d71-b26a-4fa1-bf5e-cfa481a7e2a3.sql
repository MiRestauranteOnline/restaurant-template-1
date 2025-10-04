-- Allow public (anonymous) users to create reservations
CREATE POLICY "Public can create reservations"
ON public.reservations
FOR INSERT
TO public
WITH CHECK (true);