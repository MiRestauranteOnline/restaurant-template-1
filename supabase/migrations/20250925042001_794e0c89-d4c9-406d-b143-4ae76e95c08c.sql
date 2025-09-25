-- Clean up phone numbers by removing '-test' suffix
UPDATE clients 
SET 
  phone = REPLACE(phone, '-test', ''),
  whatsapp = REPLACE(whatsapp, '-test', ''),
  email = REPLACE(email, '-test', ''),
  restaurant_name = REPLACE(restaurant_name, '-test', ''),
  address = REPLACE(address, '-test', '')
WHERE subdomain = 'demo';