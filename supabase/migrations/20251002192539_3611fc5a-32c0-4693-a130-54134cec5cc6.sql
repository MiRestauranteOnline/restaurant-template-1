-- Create reservation_schedules table
CREATE TABLE public.reservation_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0), -- Number of available seats/tables
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, day_of_week, start_time)
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size > 0),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reservation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reservation_schedules
CREATE POLICY "Public can view active schedules"
ON public.reservation_schedules
FOR SELECT
USING (is_active = true);

CREATE POLICY "Users can manage their client schedules"
ON public.reservation_schedules
FOR ALL
USING (client_id IN (
  SELECT client_id FROM public.user_clients WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can manage all schedules"
ON public.reservation_schedules
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for reservations
CREATE POLICY "Public can insert reservations"
ON public.reservations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their client reservations"
ON public.reservations
FOR SELECT
USING (client_id IN (
  SELECT client_id FROM public.user_clients WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update their client reservations"
ON public.reservations
FOR UPDATE
USING (client_id IN (
  SELECT client_id FROM public.user_clients WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can manage all reservations"
ON public.reservations
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_reservation_schedules_updated_at
BEFORE UPDATE ON public.reservation_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();