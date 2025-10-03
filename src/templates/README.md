# Restaurant Templates

This folder contains all restaurant website templates. Each template is a complete design system with its own components and layout, but shares the same data sources and business logic.

## Current Templates

### 1. Modern Restaurant (`modern-restaurant/`)
- **Status:** Production
- **Description:** Elegant dark-themed template with golden accents
- **Used by:** All current clients
- **Features:** Full-featured restaurant website with menu, reviews, reservations, etc.

## How Templates Work

### Template Structure
```
templates/
  template-name/
    index.tsx          # Main template component
    README.md          # Template-specific documentation
    (future: components/)  # Template-specific components
```

### Shared Resources
All templates use shared resources from the main `src/` folder:
- **Components:** `src/components/` (Navigation, Hero, Menu, etc.)
- **Hooks:** `src/hooks/` (useClientData, useAnalytics, etc.)
- **Contexts:** `src/contexts/` (ClientContext, etc.)
- **Database:** All templates pull from the same Supabase tables

### Template Guard System
Each template has a status (`development` or `production`) stored in the `templates` database table. This status controls:
- **Development:** Safe to modify, not used by live clients
- **Production:** Used by live clients, requires caution when modifying

The guard system logs warnings in the browser console during development to remind developers which templates are safe to modify.

## Creating a New Template

### 1. Database Setup
```sql
INSERT INTO public.templates (name, slug, status, folder_path, description)
VALUES ('Template Name', 'template-slug', 'development', 'src/templates/template-slug', 'Description');
```

### 2. Folder Structure
```bash
# Copy existing template as starting point
cp -r src/templates/modern-restaurant src/templates/template-slug
```

### 3. Update Template Code
- Edit `index.tsx` to change layout/design
- Update `README.md` with template details
- Modify slug in guard logging

### 4. Register in App.tsx
```typescript
// Add lazy import
const NewTemplate = lazy(() => import('@/templates/template-slug'));

// Add to template map (future enhancement)
const templateMap = {
  'modern-restaurant': ModernRestaurant,
  'template-slug': NewTemplate,
};
```

### 5. Test and Deploy
- Test with staging client
- Set status to 'production' when ready
- Assign to clients via `clients.template_id`

## Template Development Guidelines

### DO:
✅ Test changes on staging clients first  
✅ Be explicit in prompts: "Modify template-slug template..."  
✅ Check template guard status before making changes  
✅ Use shared components when possible  
✅ Keep templates focused on layout/design only  

### DON'T:
❌ Modify production templates without testing  
❌ Duplicate business logic across templates  
❌ Hard-code client-specific data  
❌ Break shared component interfaces  
❌ Forget to update template guard logs  

## Future Enhancements

### Planned Features:
- [ ] Dynamic template loading based on `clients.template_id`
- [ ] Template preview in dashboard
- [ ] Template marketplace
- [ ] Per-template analytics
- [ ] A/B testing between templates
- [ ] Template-specific components folder

### Template Ideas:
- Fine Dining (luxury, minimalist)
- Casual Dining (bright, playful)
- Fast Food (bold, energetic)
- Cafe/Bakery (cozy, warm)
- Bar/Nightclub (dark, vibrant)

## Technical Notes

### Data Flow
```
Database (Supabase)
    ↓
useClientData Hook
    ↓
ClientContext Provider
    ↓
Template Component
    ↓
Shared Components
```

### Template Switching
Currently: All clients use `modern-restaurant`  
Future: Load template based on `clients.template_id` → `templates.slug`

### Performance
- Templates are lazy-loaded for better initial load time
- Shared components are reused across templates
- Only one template loads per client

## Support

For questions or issues with templates, contact the development team or check the main project documentation.
