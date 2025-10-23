export const onRequest: PagesFunction = async (ctx) => {
  try {
    return await ctx.next();
  } catch (err: any) {
    const id = crypto.randomUUID?.() || String(Date.now());
    console.error('[WORKER-UNHANDLED]', { 
      id, 
      message: err?.message, 
      stack: err?.stack,
      name: err?.name,
      url: ctx.request.url
    });
    
    return new Response(JSON.stringify({
      ok: false,
      id,
      error: err?.message || 'Unknown Worker Exception',
      stack: err?.stack || null,
      name: err?.name || 'Error',
      url: ctx.request.url
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json', 
        'X-Debug-Id': id 
      }
    });
  }
};
