# Automatic Sitemap Generation - How It Works

## Overview
The restaurant website template automatically generates sitemaps based on actual content. Pages are only included in the sitemap if they have content, making it automatic and foolproof for clients.

## Automatic Logic
The sitemap generation (`/sitemap.xml`) automatically checks what content exists for each client:

- **Homepage** - Always included
- **Menu Page** (`/menu`) - Included only if active menu items exist
- **About Page** (`/about`) - Included only if active team members exist  
- **Contact Page** (`/contact`) - Always included
- **Reviews Page** (`/reviews`) - Included only if active reviews exist

## Implementation (Already Done)
The edge function at `supabase/functions/generate-sitemap/index.ts` handles this automatically by:

1. **Detecting the client** from the domain/subdomain in the request
2. **Querying the database** for actual content:
   - `reviews` table → COUNT where `client_id` matches and `is_active = true`
   - `menu_items` table → COUNT where `client_id` matches and `is_active = true`
   - `team_members` table → COUNT where `client_id` matches and `is_active = true`
3. **Building sitemap dynamically**:
   - If count > 0, include the page
   - If count = 0, exclude the page
4. **Using correct canonical URLs**:
   - Custom domain if `domain_verified = true`
   - Subdomain (`.lovable.app`) otherwise

## Benefits for Clients
✅ **No technical knowledge needed** - Just add content, pages appear automatically  
✅ **SEO-friendly** - Only pages with content are indexed by search engines  
✅ **Prevents 404s** - Empty pages aren't advertised to search engines  
✅ **Always accurate** - Sitemap reflects actual site structure in real-time  

## Real-World Examples

### Scenario 1: New Restaurant
- Client signs up, has empty database
- Sitemap includes: Homepage, Contact (2 pages)
- Client adds 10 menu items
- Sitemap automatically updates: Homepage, Menu, Contact (3 pages)

### Scenario 2: Growing Content
- Day 1: Homepage, Menu, Contact
- Day 5: Client adds first team member → About page appears in sitemap
- Day 10: Client adds first review → Reviews page appears in sitemap
- Final sitemap: All 5 pages

### Scenario 3: Content Removal
- Client has all pages active
- Client deletes all reviews (sets is_active = false)
- Reviews page disappears from sitemap automatically
- No manual intervention needed

## Dashboard Consideration
**No dashboard controls needed!** 

The system is fully automatic. Clients manage their sitemap by managing their content, which is much more intuitive than technical visibility toggles.

### Why This Is Better Than Manual Controls:
1. **Less cognitive load** - Clients don't need to understand what a "sitemap" is
2. **No mistakes** - Can't accidentally hide pages with content or show empty pages
3. **Automatic SEO optimization** - Search engines only see pages that exist
4. **One source of truth** - Content existence = page existence

## Technical Details for Developers

### Database Tables Checked:
```sql
-- Reviews
SELECT COUNT(*) FROM reviews 
WHERE client_id = ? AND is_active = true

-- Menu Items  
SELECT COUNT(*) FROM menu_items 
WHERE client_id = ? AND is_active = true

-- Team Members
SELECT COUNT(*) FROM team_members 
WHERE client_id = ? AND is_active = true
```

### Edge Function Logic:
```typescript
const hasReviews = (reviewsResult.count || 0) > 0;
const hasMenuItems = (menuItemsResult.count || 0) > 0;
const hasTeamMembers = (teamMembersResult.count || 0) > 0;

const urls = [
  { loc: baseUrl, visible: true },
  { loc: `${baseUrl}/menu`, visible: hasMenuItems },
  { loc: `${baseUrl}/about`, visible: hasTeamMembers },
  { loc: `${baseUrl}/contact`, visible: true },
  { loc: `${baseUrl}/reviews`, visible: hasReviews }
].filter(url => url.visible);
```

### Performance:
- Uses `count: 'exact', head: true` for efficient counting
- Parallel queries with `Promise.all()`
- Typical response time: < 100ms

## SEO Impact

### Positive Effects:
- Search engines only crawl pages with actual content
- No duplicate content issues from empty pages
- Better crawl budget utilization
- Improved user experience (no empty pages)

### Search Engine Behavior:
- Google/Bing discover pages via sitemap.xml
- They crawl listed URLs
- They index pages with content
- Empty pages (not in sitemap) are not discovered or indexed

## Monitoring & Debugging

### Check What's in a Client's Sitemap:
```bash
curl https://client-subdomain.lovable.app/sitemap.xml
```

### Edge Function Logs:
The function logs helpful debug info:
```
🗺️ Generate sitemap request received
📍 Host: client-subdomain.lovable.app
🔍 Looking up client by subdomain: client-subdomain
✅ Client found: [client-id]
📊 Content check: { hasReviews: true, hasMenuItems: true, hasTeamMembers: false }
✅ Generated 4 URLs for sitemap
```

## Future Enhancements (Optional)

If clients request more control in the future, you could add:
- **Manual override** - "Force hide this page even if it has content"
- **Coming soon flag** - "Show page in sitemap but display 'Coming Soon' to visitors"
- **SEO metadata per page** - Custom changefreq and priority values

But these should only be added if there's demonstrated user demand. The automatic approach works well for 95% of use cases.
