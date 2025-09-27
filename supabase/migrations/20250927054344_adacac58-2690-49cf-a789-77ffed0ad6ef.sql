-- Add review_date field to reviews table
ALTER TABLE public.reviews 
ADD COLUMN review_date DATE DEFAULT CURRENT_DATE;