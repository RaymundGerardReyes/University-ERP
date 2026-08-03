addEventListener('fetch', event => {
  event.respondWith(addHeaders(event.request));
});

async function addHeaders(request) {
  let response = await fetch(request);
  let newHeaders = new Headers(response.headers);
  
  newHeaders.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  newHeaders.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
