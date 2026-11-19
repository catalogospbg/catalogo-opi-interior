// Service worker mínimo del catálogo. Solo interviene al abrir la página:
// la pide siempre a la red, sin la copia del navegador, para que nunca quede una versión vieja.
// Sin conexión devuelve la última copia que guardó. Datos, fotos y videos no pasan por acá.
var C = 'opi-pagina-1';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || r.mode !== 'navigate') return;
  var key = r.url.split(/[?#]/)[0];
  e.respondWith(
    fetch(r.url, { cache: 'no-store' }).then(function (res) {
      if (res.ok) { var cp = res.clone(); e.waitUntil(caches.open(C).then(function (c) { return c.put(key, cp); })); }
      return res;
    }).catch(function () {
      return caches.open(C).then(function (c) { return c.match(key); }).then(function (m) { return m || Response.error(); });
    })
  );
});
