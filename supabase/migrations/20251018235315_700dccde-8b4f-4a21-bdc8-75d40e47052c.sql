-- Add duration_minutes column to reservations table
ALTER TABLE public.reservations 
ADD COLUMN duration_minutes integer NOT NULL DEFAULT 120;

-- Add comment explaining the field
COMMENT ON COLUMN public.reservations.duration_minutes IS 'Duration in minutes for this reservation, stored at booking time from the schedule';

-- Add index for better query performance when checking overlaps
CREATE INDEX IF NOT EXISTS idx_reservations_time_lookup 
ON public.reservations(client_id, reservation_date, reservation_time, status) 
WHERE status IN ('pending', 'confirmed');