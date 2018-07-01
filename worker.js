// // import IndexedDB from "./IndexedDB";

'use strict';

const cacheName = 'cache-v1';

    const filesToCache = [
                // './offline.html',
                  './app.js',
                  './index.html',
                  'styles.css',
                  './bkground.jpg',
                  'IndexedDB.js'
    ];

    self.addEventListener('install', event => { 
      event.waitUntil(
       caches.open(cacheName)
       .then(cache => {
           console.info('Caching of files');
           return cache.addAll(filesToCache);
       })
     );
    });

    self.addEventListener('activate', event => {
      event.waitUntil(
          caches.keys()
            .then(keyList => Promise.all(keyList.map(thisCacheName => {
           if (thisCacheName !== cacheName){
               console.log("Service worker removing cached files from", thisCacheName);
               return caches.delete(thisCacheName);
           }
       })))
        );
      return self.clients.claim();
    });


    self.addEventListener('fetch', event => {
      event.respondWith(caches.match(event.request)
        .then(response => response || fetch(event.request)
     .then(response => caches.open(cacheName)
     .then(cache => {
       cache.put(event.request, response.clone());
       return response;
     })).catch(event => {
     console.log('Service Worker error caching and fetching');
   }))
     );
    });

// // Incrementing CACHE_VERSION will kick off the install event and force previously cached
// // resources to be cached again.
// const CACHE_VERSION = 1;
// let CURRENT_CACHES = {
//   offline: 'offline-v' + CACHE_VERSION,
// };

// const OFFLINE_URL = './offline.html';
// const storeName = 'currenciesStore';
// const indexName = 'indexCurrencies';

let DB = null;

async function createDBStore(storeName,indexName){
  
  let db = await IndexedDB.init({target:self, config:{dbName:'dubby20'}});

  let store = db.createObjectStore(storeName, {keyPath: "id"});
  store.createIndex(indexName, ["data"]);

  DB = db;
}

// function readDB(db, req, overrideKey){
//    return new Promise((resolve, reject) => {
//         let tx = db.transaction(storeName, "readonly");
//         let store = tx.objectStore(storeName);

//         req.text().then((text) => {
//           let key = overrideKey || text.replace('?','').replace('&compact=ultra','').replace('q=','');
//           let handle = (req.url.indexOf('/currencies')+1)? store.getAll() : store.get(key);

//           handle.onsuccess = () => {
//               resolve(new Response(handle.result.data));
//           }
//         });
//    });
// }

// function writeDB(db, req, res, overrideKey){
//      let tx = db.transaction(storeName, "readwrite");
//      let store = tx.objectStore(storeName);

//      return req.text().then((text) => {
//         let key = overrideKey || text.replace('?','').replace('&compact=ultra','').replace('q=','');
//         res.json().then((json) => {
          
//             store.put(
//               {id:key, data:json}
//             )
          
//         });
//         return res;
//     });
// }


// self.addEventListener('install', event => {
//   importScripts('./IndexedDB.js');
//   event.waitUntil(
//     /*fetch(OFFLINE_URL)).then(function(response) {*/
//       caches.open(CURRENT_CACHES.offline).then((cache) => {
//         //return cache.put(OFFLINE_URL, response);
//         return cache.addAll(
//           [
//             './offline.html',
//             './app.js',
//             './index.html',
//             'styles.css',
//             './bkground.jpg',
//             'IndexedDB.js'
//           ]
//         );
//       })
//     /*})*/
//   );
// });

// self.addEventListener('activate', event => {
//   // Delete all caches that aren't named in CURRENT_CACHES.
//   // While there is only one cache in this example, the same logic will handle the case where
//   // there are multiple versioned caches.
//   let expectedCacheNames = Object.keys(CURRENT_CACHES).map((key) => {
//     return CURRENT_CACHES[key];
//   });

//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       DB = createDBStore(storeName, indexName);
//       return Promise.all(
//         cacheNames.map(cacheName => {
//           if (expectedCacheNames.indexOf(cacheName) === -1) {
//             // If this cache name isn't present in the array of "expected" cache names,
//             // then delete it.
//             console.log('Deleting out of date cache:', cacheName);
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// let _self = self;

// self.addEventListener('fetch', event => {

//   // let DB = IndexedDB.getDB(_self);

//      caches.open(CURRENT_CACHES.offline).then((cache) => {
//         return fetch(event.target).then((response) => {
//           if(event.request.headers.get('accept').indexOf('*/*') + 1
//         && response.headers.get('content-type').indexOf('json') + 1) {
//           return writeDB(DB, event.request, response, (event.request.url.indexOf('currencies')
//         +1 ? 'curr': null));
//         } else {
//           cache.put(event.request, response.clone());
//           return response;
//         }
//         }).catch((error) => {
//           console.log('Fetch failed: trying alternatives...', error);
//           cache.match(event.request).then((response) => {
//             return response || readDB(DB, event.request, (event.request.url.indexOf('currencies')
//           + 1 ? 'curr' : null));
//           }).catch(() => {
//             return cache.match(OFFLINE_URL);
//           });
//         });
//       })
//     // );
// //   
//  });
