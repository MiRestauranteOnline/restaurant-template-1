export const onRequestGet: PagesFunction = async () => {
  try {
    return new Response(
      JSON.stringify({ ok: true, runtime: 'pages-functions', ts: Date.now() }, null, 2),
      { headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' } }
    );
  } catch (e: any) {
    const id = crypto.randomUUID?.() || String(Date.now());
    console.error('[WORKER-UNHANDLED]', { id, message: e?.message, stack: e?.stack });
    return new Response(
      JSON.stringify({ ok: false, id, error: e?.message || 'health failure' }),
      { status: 500, headers: { 'content-type': 'application/json', 'x-debug-id': id } }
    );
  }
};
