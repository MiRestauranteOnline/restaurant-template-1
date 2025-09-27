-- Remove navigation label fields
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS navigation_home_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS navigation_about_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS navigation_menu_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS navigation_contact_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS navigation_reviews_label;

-- Remove button label fields
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS view_full_menu_button_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS call_button_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS whatsapp_button_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS reserve_table_button_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS more_info_button_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS back_to_home_button_label;

-- Remove form label fields
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS name_field_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS email_field_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS phone_field_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS message_field_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS send_message_button_label;

-- Remove footer label fields
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS quick_links_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS contact_info_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS follow_us_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS opening_hours_label;

-- Remove menu page label fields
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS categories_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS price_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS description_label;

-- Remove reviews page label fields
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS customer_reviews_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS rating_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS review_date_label;

-- Remove error and status label fields
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS page_not_found_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS loading_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS error_label;
ALTER TABLE public.admin_content DROP COLUMN IF EXISTS try_again_label;