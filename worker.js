// import IndexedDB from "./IndexedDB";
// const IndexedDB = require('./IndexedDB');

'use strict';

importScripts('./IndexedDB.js');

// Incrementing CACHE_VERSION will kick off the install event and force previously cached
// resources to be cached again.
const CACHE_VERSION = 1;
let CURRENT_CACHES = {
  offline: 'offline-v' + CACHE_VERSION,
};

const OFFLINE_URL = './offline.html';
const storeName = 'currenciesStore';
const indexName = 'indexCurrencies';

let DB = null;

async function createDBStore(storeName,indexName){
  
  let db = await IndexedDB.init({target:self, config:{dbName:'dubby20'}});

  let store = db.createObjectStore(storeName, {keyPath: "id"});
  store.createIndex(indexName, ["data"]);

  DB = db;
}

function readDB(db, req, overrideKey){
   return new Promise((resolve, reject) => {
        let tx = db.transaction(storeName, "readonly");
        let store = tx.objectStore(storeName);

        req.text().then((text) => {
          let key = overrideKey || text.replace('?','').replace('&compact=ultra','').replace('q=','');
          let handle = (req.url.indexOf('/currencies')+1)? store.getAll() : store.get(key);

          handle.onsuccess = () => {
              resolve(new Response(handle.result.data));
          }
        });
   });
}

function writeDB(db, req, res, overrideKey){
     let tx = db.transaction(storeName, "readwrite");
     let store = tx.objectStore(storeName);

     return req.text().then((text) => {
        let key = overrideKey || text.replace('?','').replace('&compact=ultra','').replace('q=','');
        res.json().then((json) => {
          
            store.put(
              {id:key, data:json}
            )
          
        });
        return res;
    });
}


self.addEventListener('install', event => {
  event.waitUntil(
    /*fetch(OFFLINE_URL)).then(function(response) {*/
      caches.open(CURRENT_CACHES.offline).then((cache) => {
        //return cache.put(OFFLINE_URL, response);
        return cache.addAll(
          [
            '.',
            './app.js',
            './index.html',
            'styles.css',
            './bkground.jpg',
            'IndexedDB.js'
          ]
        );
      })
    /*})*/
  );
});

self.addEventListener('activate', event => {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  let expectedCacheNames = Object.keys(CURRENT_CACHES).map((key) => {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(cacheNames => {
      DB = createDBStore(storeName, indexName);
      return Promise.all(
        cacheNames.map(cacheName => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names,
            // then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

let _self = self;

self.addEventListener('fetch', event => {

  let DB = IndexedDB.getDB(_self);

  if (event.request.mode === 'navigate' ||
      (event.request.headers.get('accept').includes('*/*'))) {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
      fetch(event.request).then((response) => {
          return response;
      }).catch(error => {
        // The catch is only triggered if fetch() throws an exception, which will most likely
        // happen due to the server being unreachable.
        // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
        // range, the catch() will NOT be called. If you need custom handling for 4xx or 5xx
        console.log('Fetch failed; returning offline page instead.', error);
        return caches.match(OFFLINE_URL);
      })
    );
  }else if(event.request.url.indexOf('free.currencyconverterapi.com/api/v5/convert') + 1 
      && event.request.method === 'GET'){
        event.respondWith(
           fetch(event.request).then((response) => {
                return writeDB(DB, event.request, response);
           }).catch((error)=> {
                return readDB(DB, event.request);
           })
        )
  }else if(event.request.url.indexOf('free.currencyconverterapi.com/api/v5/currencies') + 1 
  && event.request.method === 'GET'){
    event.respondWith(
      fetch(event.request).then((response)=> {
           return writeDB(DB, event.request, response, 'curr');
      }).catch((error) => {
           return readDB(DB, event.request, 'curr');
      })
   )
  }

  // If our if() condition is false, then this fetch handler won't intercept the request.
  // If there are any other fetch handlers registered, they will get a chance to call
  // event.respondWith(). If no fetch handlers call event.respondWith(), the request will be
  // handled by the browser as if there were no service worker involvement.
});
