const openRequest = indexedDB.open('diary', 1);

let db;

openRequest.onupgradeneeded = function(e) {
  db.createObjectStore('firstOS');
};

openRequest.onsuccess = function(e) {
  console.log('success');
  db = e.target.result;
};

openRequest.onerror = function(e) {
  console.log('error', e);
};

// db.createObjectStore("firstOS");
