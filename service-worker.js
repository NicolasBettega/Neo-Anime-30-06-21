// Nombre del Cache
const cacheName = 'cache-version-1';

// Archivos/Recursos que vamos a "cachear saraza"
const precache = [
  //principal 
'./animes.html',
'./mangas.html',
// './contacto.html',
'./index.html',
'./offline.html',
'./service-worker.js',
'./manifest.webmanifest',
  //css
// './css/bootstrap-grid.css',
// './css/bootstrap-grid.css.map',
'./css/bootstrap-grid.min.css',
'./css/bootstrap-grid.min.css.map',
// './css/bootstrap-reboot.css',
// './css/bootstrap-reboot.css.map',
'./css/bootstrap-reboot.min.css',
'./css/bootstrap-reboot.min.css.map',
// './css/bootstrap.css',
// './css/bootstrap.css.map',
'./css/bootstrap.min.css',
'./css/bootstrap.min.css.map',
'./css/estilo.css',

  //js
'./js/anime-api.js',
// './js/bootstrap.bundle.js',
// './js/bootstrap.bundle.js.map',
'./js/bootstrap.bundle.min.js',
'./js/bootstrap.bundle.min.js.map',
// './js/bootstrap.js',
// './js/bootstrap.js.map',
'./js/bootstrap.min.js',
'./js/bootstrap.min.js.map',
'./js/jquery-3.5.1.min.js',
'./js/jquery-3.5.1.slim.min.js',
'./js/manga-api.js',
'./js/register-sw.js',

//game
'js/game-memory/img-game/dod-chibi.png',
'js/game-memory/img-game/gojo-intro.png',
'js/game-memory/img-game/kakashi-chibi.png',
'js/game-memory/img-game/levi-chibi.png',
'js/game-memory/img-game/naruto-chibi.png',
'js/game-memory/img-game/sao-chibi.png',
'js/game-memory/img-game/yato-chibi.png',
'./js/game-memory/jquery.min.js',
'./js/game-memory/script.js',
'./js/game-memory/style.css',


  //res
  './res/font/animeace.ttf',
  './res/font/LeagueGothic-Regular.otf',
  './res/font/Montserrat-Bold.otf',
  './res/font/Montserrat-Regular.otf',

  './res/img/icon/estrella.svg',
  './res/img/icon/facebook-f.svg',
  './res/img/icon/instagram.svg',
  './res/img/icon/logo.svg',
  './res/img/icon/twitter.svg',
  './res/img/error-search-chibi.png',
  './res/img/icon-192x192.png',
  './res/img/icon-256x256.png',
  './res/img/icon-384x384.png',
  './res/img/icon-512x512.png',
  './res/img/otro-intro.png',
  
];


// Instalación
self.addEventListener('install', event => {

  // Hago a este SW el activo, matando otros
  // Sino quedan caches inactivos 
  self.skipWaiting();

  event.waitUntil(
      // Abro el cache, entonces agrego los archivos/recursos
      caches.open(cacheName).then(cache => {
        return cache.addAll(precache)
      })
  );
});


// Update - Es decir, si cambia una parte del SW (nombre), updatea el cache 
self.addEventListener('activate', event => {

  const cacheWhitelist = [cacheName];

  // Esto es lo que updatea cada una de las keys en el mapa del caché
  event.waitUntil(
      // Tomo las keys y las paso para revisar individualmente
      caches.keys().then(cacheNames => {
        // devuelvo Promesa
        return Promise.all(
            // Hago un map, para borrar key individualmente.
            // Recuerden que era el update, asi que precisa un delete.
            cacheNames.map(cacheName => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
        )
      })
  );
});


// Chequeamos la response
function shouldAcceptResponse(response) {
    return response.status !== 0 && !(response.status >= 400 && response.status < 500) || 
        response.type === 'opaque' || 
        response.type === 'opaqueredirect';
}


// Creamos el cache a partir de fetch de recursos
self.addEventListener('fetch', event => {
  // Chequeamos si existe en cache para el render de pagina
  // sino vamos a hacer cache del nuevo request
  event.respondWith(
      caches.open(cacheName).then(cache => { // Abrimos el cache actual
        return cache.match(event.request).then(response => {
          
          // Matcheo! - return response, se lo pasamos al promise abajo
          if (response) {
            return response;
          }

        // Tomamos el response cache de arriba
        return fetch(event.request).then(
          function(response) {

            // Chequeamos si recibimos una respuesta valida
            if(shouldAcceptResponse(response)) {
              return response;
            }

            // Hay que clonar la respuesta
            // La respuesta es un stream, y como queremos que el browser
            // consuma la respuesta como si el cache consumiera la respuesta,
            // necesitamos clonarla para asi tener dos streams: (https://streams.spec.whatwg.org/)
            var responseToCache = response.clone();

            // Aca lo que hace es guardar los recursos que vinieron del server
            caches.open(cacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        )
        }).catch(error => {
          console.log('Fallo SW', error); // importantisimo para saber si tenemos un error en algun lado.
          // si el cache falla, mostramos offline page
          return caches.match('offline.html');
        });
      })
  );
});