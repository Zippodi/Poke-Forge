//inspired from lecture 23 code
function log(...data) {
  console.log("SWv1.0", ...data);
}

const STATIC_CACHE_NAME = 'pokeforge-static-v0';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      cache.addAll([
        '/offline',
        //CSS
        '/css/main.css',
        '/css/stylesindex.css',
        '/css/not-found.css',
        '/css/loginstyle.css',
        '/css/pokemon/pokesprite-pokemon-gen8.css',
        '/css/pokemon-data/entry.css',
        '/css/pokemon-data/main.css',
        '/css/pokemon-data/pokemon.css',
        '/css/viewotherteamsstyle.css',
        //Images
        '/images/category/physical.png',
        '/images/category/special.png',
        '/images/category/status.png',
        '/images/svg/check.svg',
        '/images/svg/exclaim.svg',
        '/images/svg/x.svg',
        '/images/mystery.png',
        '/images/Poke-Forge.png',
        //type images
        '/images/types/bug.png',
        '/images/types/dark.png',
        '/images/types/dragon.png',
        '/images/types/electric.png',
        '/images/types/fairy.png',
        '/images/types/fighting.png',
        '/images/types/fire.png',
        '/images/types/flying.png',
        '/images/types/ghost.png',
        '/images/types/grass.png',
        '/images/types/ground.png',
        '/images/types/ice.png',
        '/images/types/mystery.png',
        '/images/types/normal.png',
        '/images/types/poison.png',
        '/images/types/psychic.png',
        '/images/types/rock.png',
        '/images/types/steel.png',
        '/images/types/water.png',
        //Scripts
        '/js/utils/HTTPClient.js',
        '/js/utils/PokemonUtils.js',
        '/js/utils/responsive.js',
        '/js/all.js',
        '/js/homescript.js',
        '/js/loginscript.js',
        '/js/vieweditteamsscript.js',
        '/js/viewotherteamsscript.js',
        //external resources (bootstrap)
        'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('pokeforge-') && cacheName != STATIC_CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);
  //Treat API calls (to our API) differently
  if (requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
    //Intercept calls to API
    if (event.request.method === "GET") {
      if (requestUrl.pathname.includes('teams') || requestUrl.pathname.includes('currentuser')) {
        event.respondWith(
          cacheLast(event.request)
        );
      } else {
        event.respondWith(
          cacheFirst(event.request)
        );
      }
    }
  }
  else {
    let x = cacheFirst(event.request);
    //Not a call to our API
    event.respondWith(x);
  }
});


function cacheFirst(request) {
  return caches.match(request)
    .then(response => {
      //Return response from cache if exists, otherwise get from api and cache result
      return response || fetchAndCache(request);
    }).catch(error => {
      return caches.match('/offline');
    });
}

function cacheLast(request) {
  return fetchAndCache(request).catch(err => {
    return caches.match(request)
      .then(response => {
        //Return response from cache if exists
        return response;
      }).catch(error => {
        return caches.match('/offline');
      });
  });
}

function fetchAndCache(request) {
  return fetch(request).then(response => {
    var requestUrl = new URL(request.url);
    //Cache everything except login and register
    if (response.ok && requestUrl.pathname != '/' && !requestUrl.pathname.startsWith('/register') && !requestUrl.pathname.startsWith('/create')
      && !requestUrl.pathname.startsWith('/editteam') && !requestUrl.protocol.startsWith('chrome-extension')) {
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        cache.put(request, response);
      });
    }
    return response.clone();
  });
}

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});