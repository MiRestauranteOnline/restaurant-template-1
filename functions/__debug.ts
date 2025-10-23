export const onRequest: PagesFunction = async ({ request }) => {
  const isBrowser = typeof window !== 'undefined';
  const isDocument = typeof document !== 'undefined';
  const hasCrypto = typeof crypto !== 'undefined';
  const hasLocalStorage = typeof localStorage !== 'undefined';
  const hasSessionStorage = typeof sessionStorage !== 'undefined';
  const hasNavigator = typeof navigator !== 'undefined';
  const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';
  
  return new Response(JSON.stringify({
    ok: true,
    timestamp: new Date().toISOString(),
    runtime: {
      isBrowser,
      isDocument,
      hasCrypto,
      hasLocalStorage,
      hasSessionStorage,
      hasNavigator,
      hasIntersectionObserver,
      hasProcess: typeof process !== 'undefined',
      nodeVersion: (globalThis as any).process?.version || null,
      userAgent: request.headers.get('user-agent')
    },
    request: {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers)
    },
    analytics: {
      hasProvider: !!(globalThis as any).__ANALYTICS_PROVIDER_INIT__,
      queueConfigured: !!(globalThis as any).__ANALYTICS_QUEUE__,
      errorCount: (globalThis as any).__ANALYTICS_ERRORS__ || 0
    },
    supabase: {
      urlConfigured: typeof import.meta !== 'undefined' && 
                     typeof import.meta.env !== 'undefined' &&
                     typeof import.meta.env.VITE_SUPABASE_URL === 'string',
      keyConfigured: typeof import.meta !== 'undefined' &&
                     typeof import.meta.env !== 'undefined' &&
                     typeof import.meta.env.VITE_SUPABASE_ANON_KEY === 'string'
    }
  }, null, 2), { 
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    } 
  });
};
