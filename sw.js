var APP_PREFIX = "CWN_"; // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = "version_01"; // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [
  // Add URL you want to cache in this list.
  "https://codewithnabin.github.io/", // If you have separate JS/CSS files,
  "https://codewithnabin.github.io/index.html", // add path to those files here
  "https://codewithnabin.github.io/assets/css/style.css",
  "https://codewithnabin.github.io/assets/icons/moon-solid.svg",
  "https://codewithnabin.github.io/assets/icons/sun-solid.svg",
  "https://codewithnabin.github.io/assets/icons/android-chrome-512x512.png",
  "https://codewithnabin.github.io/assets/images/cover.png",
  "https://codewithnabin.github.io/assets/images/logo.png",
  "https://codewithnabin.github.io/assets/images/profile.png",
  "https://codewithnabin.github.io/assets/images/section-image-1.jpg",
  "https://codewithnabin.github.io/assets/images/section-image-2.jpg",
  "https://codewithnabin.github.io/assets/images/section-image-3.jpg",
  "https://codewithnabin.github.io/assets/js/script.js",
];

// Respond with cached resources
self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        // if cache is available, respond with cache
        console.log("responding with cache : " + e.request.url);
        return request;
      } else {
        // if there are no cache, try fetching request
        console.log("file is not cached, fetching : " + e.request.url);
        return fetch(e.request);
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  );
});

// Cache resources
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(URLS);
    })
  );
});

// Delete outdated caches
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheWhitelist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
