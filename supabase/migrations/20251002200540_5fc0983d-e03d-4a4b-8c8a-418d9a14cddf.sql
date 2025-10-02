-- Update demos client to active status so it can be viewed publicly
UPDATE clients 
SET subscription_status = 'active',
    subscription_start_date = now(),
    subscription_end_date = now() + interval '1 year'
WHERE subdomain = 'demos';