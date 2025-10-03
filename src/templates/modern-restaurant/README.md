# Modern Restaurant Template

**Status:** Production (check database for current status)

## Overview
Elegant and modern restaurant template with dark theme. This is the original template used by all existing clients.

## Features
- Dark theme with golden accents
- Responsive design
- Image carousel
- Menu categories
- Delivery integrations
- Reservation booking
- Customer reviews
- Contact forms

## Template Guard
This template's status (development/production) is managed in the `templates` table in Supabase. When set to "production", any modifications will affect live client websites.

## Development Guidelines
- **Always check template status** before making changes
- Test changes on staging clients first
- Be explicit when requesting changes: "Modify modern-restaurant template..."
- Review template guard warnings in browser console

## Components Used
All components are shared across templates and located in `src/components/`:
- Navigation
- Hero
- About
- Menu
- Services
- Contact
- Footer
- etc.

## Customization
Client-specific customizations come from database:
- Colors, fonts → `client_settings` table
- Content → `admin_content` table
- Menu items → `menu_items` table
- Reviews → `reviews` table

The template only controls the layout and structure, not the content.
