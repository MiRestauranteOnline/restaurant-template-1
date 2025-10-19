# Dashboard: Page Visibility Controls Implementation

## Overview
This document outlines what needs to be added to the dashboard to allow clients to control which pages appear in their sitemap and are accessible on their site.

## Current Database Schema

The `admin_content` table already has several visibility flags that control homepage sections. These can be leveraged for page-level visibility:

### Existing Fields (Already in Database):
```sql
-- These fields already exist in admin_content table:
homepage_about_section_visible BOOLEAN DEFAULT true
homepage_menu_section_visible BOOLEAN DEFAULT true
homepage_contact_section_visible BOOLEAN DEFAULT true
homepage_reviews_section_visible BOOLEAN DEFAULT true
homepage_services_section_visible BOOLEAN DEFAULT true
homepage_reservations_section_visible BOOLEAN DEFAULT true
homepage_faq_section_visible BOOLEAN DEFAULT true
homepage_delivery_section_visible BOOLEAN DEFAULT true
```

## What the Dynamic Sitemap Currently Does

The new `generate-sitemap` edge function automatically:
1. Detects the client's domain (custom or subdomain)
2. Reads the `admin_content` visibility flags
3. Only includes pages in the sitemap where the corresponding section is visible
4. Uses the correct domain (custom if verified, otherwise subdomain)

### Current Logic:
- **Homepage**: Always visible (priority 1.0)
- **Menu Page**: Visible if `homepage_menu_section_visible !== false` (priority 0.8)
- **About Page**: Visible if `homepage_about_section_visible !== false` (priority 0.7)
- **Contact Page**: Visible if `homepage_contact_section_visible !== false` (priority 0.7)
- **Reviews Page**: Visible if `homepage_reviews_section_visible !== false` (priority 0.6)

## Recommended Dashboard Implementation

### Option 1: Leverage Existing Fields (Simplest)
Since the visibility flags already exist, you can add a UI section in the dashboard:

**Location**: Settings → Pages & SEO

**UI Structure**:
```
┌─────────────────────────────────────────────┐
│ Page Visibility Settings                     │
├─────────────────────────────────────────────┤
│                                              │
│ ☑ Menu Page                                 │
│   Show menu page and include in sitemap     │
│   [Field: homepage_menu_section_visible]    │
│                                              │
│ ☑ About Page                                │
│   Show about page and include in sitemap    │
│   [Field: homepage_about_section_visible]   │
│                                              │
│ ☑ Contact Page                              │
│   Show contact page and include in sitemap  │
│   [Field: homepage_contact_section_visible] │
│                                              │
│ ☑ Reviews Page                              │
│   Show reviews page and include in sitemap  │
│   [Field: homepage_reviews_section_visible] │
│                                              │
│ ℹ️ Pages that are hidden will not appear    │
│   in your sitemap or be accessible to       │
│   visitors.                                  │
│                                              │
│ [Save Changes]                               │
└─────────────────────────────────────────────┘
```

### Option 2: Add Dedicated Page-Level Fields (More Explicit)
If you want to separate homepage section visibility from page-level visibility, add new fields:

**New Fields to Add** (via Supabase migration):
```sql
ALTER TABLE admin_content
ADD COLUMN menu_page_visible BOOLEAN DEFAULT true,
ADD COLUMN about_page_visible BOOLEAN DEFAULT true,
ADD COLUMN contact_page_visible BOOLEAN DEFAULT true,
ADD COLUMN reviews_page_visible BOOLEAN DEFAULT true;
```

**Then update the edge function** to check these new fields instead.

## Frontend Code Changes Needed

### 1. Dashboard Component (React/TypeScript)
```typescript
// Example: src/components/dashboard/PageVisibilitySettings.tsx

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PageVisibilityProps {
  clientId: string;
  initialSettings: {
    homepage_menu_section_visible: boolean;
    homepage_about_section_visible: boolean;
    homepage_contact_section_visible: boolean;
    homepage_reviews_section_visible: boolean;
  };
}

export function PageVisibilitySettings({ clientId, initialSettings }: PageVisibilityProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);

  const handleToggle = (field: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('admin_content')
        .update(settings)
        .eq('client_id', clientId);

      if (error) throw error;
      
      // Show success toast
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      // Show error toast
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">Page Visibility Settings</h2>
      <p className="text-sm text-gray-600">
        Control which pages are visible on your site and included in your sitemap.
      </p>

      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.homepage_menu_section_visible}
            onChange={() => handleToggle('homepage_menu_section_visible')}
            className="form-checkbox h-5 w-5"
          />
          <div>
            <div className="font-medium">Menu Page</div>
            <div className="text-sm text-gray-500">
              Show menu page and include in sitemap
            </div>
          </div>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.homepage_about_section_visible}
            onChange={() => handleToggle('homepage_about_section_visible')}
            className="form-checkbox h-5 w-5"
          />
          <div>
            <div className="font-medium">About Page</div>
            <div className="text-sm text-gray-500">
              Show about page and include in sitemap
            </div>
          </div>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.homepage_contact_section_visible}
            onChange={() => handleToggle('homepage_contact_section_visible')}
            className="form-checkbox h-5 w-5"
          />
          <div>
            <div className="font-medium">Contact Page</div>
            <div className="text-sm text-gray-500">
              Show contact page and include in sitemap
            </div>
          </div>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.homepage_reviews_section_visible}
            onChange={() => handleToggle('homepage_reviews_section_visible')}
            className="form-checkbox h-5 w-5"
          />
          <div>
            <div className="font-medium">Reviews Page</div>
            <div className="text-sm text-gray-500">
              Show reviews page and include in sitemap
            </div>
          </div>
        </label>
      </div>

      <div className="pt-4 border-t">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded">
        ℹ️ <strong>Note:</strong> Pages that are hidden will not appear in your sitemap.xml 
        and will not be accessible to visitors. The sitemap updates automatically.
      </div>
    </div>
  );
}
```

### 2. Fetching Initial Data
```typescript
// In your dashboard page component
const { data: adminContent } = await supabase
  .from('admin_content')
  .select(`
    homepage_menu_section_visible,
    homepage_about_section_visible,
    homepage_contact_section_visible,
    homepage_reviews_section_visible
  `)
  .eq('client_id', clientId)
  .single();
```

## How It All Works Together

### User Flow:
1. **Client logs into dashboard**
2. **Goes to Settings → Pages & SEO**
3. **Toggles page visibility checkboxes**
4. **Clicks "Save Changes"**
5. **Dashboard updates `admin_content` table**
6. **Sitemap automatically updates** (no rebuild needed)

### Technical Flow:
1. Client visits `https://theirsite.com/sitemap.xml`
2. Request goes to `generate-sitemap` edge function
3. Edge function:
   - Detects domain (custom or subdomain)
   - Queries `clients` table
   - Queries `admin_content` table for visibility flags
   - Generates XML with only visible pages
   - Returns sitemap with correct domain
4. Search engines index only the visible pages

## Testing

### Test Cases:
1. ✅ Hide menu page → Menu should not appear in sitemap
2. ✅ Custom domain verified → Sitemap uses custom domain
3. ✅ Custom domain not verified → Sitemap uses subdomain
4. ✅ All pages hidden except home → Sitemap shows only homepage
5. ✅ Change visibility → Sitemap updates immediately (no cache issues)

### Testing Commands:
```bash
# View sitemap for a specific client
curl https://client-subdomain.lovable.app/sitemap.xml

# View sitemap for custom domain
curl https://customdomain.com/sitemap.xml
```

## Additional Considerations

### SEO Impact:
- Pages removed from sitemap may lose rankings
- Recommend showing a warning: "⚠️ Hiding this page will affect SEO"
- Consider adding a "Hide from menu but keep in sitemap" option

### Access Control:
- Hidden pages should return 404 or redirect to homepage
- Update routing logic in the main app to respect visibility flags

### Future Enhancements:
- Add priority and changefreq controls per page
- Add custom meta descriptions per page
- Add "noindex" option (page exists but not in sitemap)
- Add temporary hiding with scheduled re-enabling

## Support & Documentation

Link to these resources in the dashboard:
- [SEO Best Practices Documentation](https://docs.example.com/seo)
- [Sitemap Guidelines](https://docs.example.com/sitemap)
- Support ticket system for questions

## Questions?

If you need any clarification or have technical questions about the implementation, please reach out to the backend team.
