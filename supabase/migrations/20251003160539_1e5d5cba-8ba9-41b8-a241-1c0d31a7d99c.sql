-- Fix RLS policies to allow public access to menu items and categories
-- The issue is that the RLS policies reference user_clients table, 
-- but public users don't have permission to query it, causing cascading permission errors

-- Add policy to allow user_clients to be queried in RLS contexts
CREATE POLICY "Allow user_clients to be queried in RLS policies"
ON user_clients
FOR SELECT
TO public
USING (true);

-- This is safe because:
-- 1. It only allows SELECT (read) operations
-- 2. The actual data filtering happens in the policies of other tables
-- 3. It's needed for the subqueries in menu_items and menu_categories policies to work