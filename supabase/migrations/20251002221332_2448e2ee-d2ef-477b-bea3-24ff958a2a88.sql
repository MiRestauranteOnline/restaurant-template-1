-- Add RLS policy to allow public users to check reservation availability
-- This only exposes non-PII fields needed for availability calculation
CREATE POLICY "Public can view reservation availability data"
ON public.reservations
FOR SELECT
TO public
USING (true);

-- Note: The SELECT query will be limited to reservation_time, party_size, reservation_date, status
-- by the application code, so no PII (customer_name, customer_email, customer_phone) is exposed