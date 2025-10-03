import { supabase } from '@/integrations/supabase/client';

export interface TemplateGuard {
  id: string;
  slug: string;
  status: 'development' | 'production';
  name: string;
  clientCount: number;
}

let cachedGuards: TemplateGuard[] = [];

/**
 * Fetch all template guards from database
 */
export async function getTemplateGuards(): Promise<TemplateGuard[]> {
  if (cachedGuards.length > 0) return cachedGuards;
  
  const { data, error } = await supabase
    .from('templates')
    .select('id, slug, status, name, client_count')
    .eq('is_active', true);
  
  if (error) {
    console.error('Failed to load template guards:', error);
    return [];
  }
  
  cachedGuards = (data || []).map(t => ({
    id: t.id,
    slug: t.slug,
    status: t.status as 'development' | 'production',
    name: t.name,
    clientCount: t.client_count
  }));
  
  return cachedGuards;
}

/**
 * Get status of a specific template
 */
export async function getTemplateStatus(slug: string): Promise<'development' | 'production'> {
  const guards = await getTemplateGuards();
  const template = guards.find(g => g.slug === slug);
  return template?.status || 'development';
}

/**
 * Get guard message based on template status
 */
export function getGuardMessage(status: 'development' | 'production', clientCount: number): string {
  if (status === 'production') {
    return `
🚨 PRODUCTION TEMPLATE - LIVE FOR ${clientCount} CLIENTS
DO NOT MODIFY unless explicitly requested.
Any changes will affect live client websites immediately.
    `.trim();
  } else {
    return `
✅ DEVELOPMENT TEMPLATE - Safe to modify
This template is currently in development.
Not yet used by live clients. Safe to iterate and experiment.
    `.trim();
  }
}

/**
 * Clear cached guards (useful for testing or when templates are updated)
 */
export function clearGuardCache() {
  cachedGuards = [];
}
