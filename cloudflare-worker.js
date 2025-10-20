// Cloudflare Worker for wildcard subdomain routing
// Deploy this worker to handle *.mirestaurante.online

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const hostname = url.hostname
  
  // Extract subdomain from hostname
  // e.g., demo.mirestaurante.online -> demo
  const subdomain = hostname.split('.')[0]
  
  console.log(`Routing request for subdomain: ${subdomain}`)
  
  // Target Pages deployment for all client sites
  const TARGET_PAGES = 'restaurant-template-1.pages.dev'
  
  // Create new URL pointing to the Pages deployment
  const targetUrl = new URL(request.url)
  targetUrl.hostname = TARGET_PAGES
  
  // Create new request with modified URL
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'manual'
  })
  
  // Add the original hostname as a header so the app can detect which subdomain was requested
  modifiedRequest.headers.set('X-Forwarded-Host', hostname)
  
  // Fetch from Pages deployment
  const response = await fetch(modifiedRequest)
  
  // Return response with CORS headers if needed
  const newResponse = new Response(response.body, response)
  
  // Preserve all original headers
  return newResponse
}
