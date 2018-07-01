
let db;

self.IndexedDB = {
      getDB(target){
        
          var indexedDB = target.indexedDB || target.mozIndexedDB || target.webkitIndexedDB || target.msIndexedDB || target.shimIndexedDB;
          
          return indexedDB.open('dubby20', 1);
      },
      init({target, config} = {}){

        if (!('indexedDB' in target)) {
          console.log('This browser doesn\'t support IndexedDB');
          return Promise.resolve(null);
        }

        var indexedDB = target.indexedDB || target.mozIndexedDB || target.webkitIndexedDB || target.msIndexedDB || target.shimIndexedDB;

        // Open (or create) the database
        var open = indexedDB.open(config.dbName, 1);

        return new Promise((resolve, reject) => {

              // Create the schema
              open.onupgradeneeded = () => {
                  db = open.result;
                  resolve(db);

              };

              open.onerror = (e)=> {

                  reject(e);
              }

              open.onsuccess = () => {
                  // Start a new transaction
                  //db = open.result;
                  
              }
          });
      },
      close(tx){
        // Close the db when the transaction is done
        tx.oncomplete = () => {
            db.close();
        };
      }
};
