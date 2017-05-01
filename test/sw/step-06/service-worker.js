/*
  install
  activate
  fetch
*/

var cacheName = 'weatherPWA-step-6-1';
var filesToCache = [
  './',
  './index.html',
  './scripts/app.js',
  './styles/inline.css',
  './images/clear.png',
  './images/cloudy-scattered-showers.png',
  './images/cloudy.png',
  './images/fog.png',
  './images/ic_add_white_24px.svg',
  './images/ic_refresh_white_24px.svg',
  './images/partly-cloudy.png',
  './images/rain.png',
  './images/scattered-showers.png',
  './images/sleet.png',
  './images/snow.png',
  './images/thunderstorm.png',
  './images/wind.png'
];
/*
  首先，我们需要通过 caches.open() 打开缓存并提供一个缓存名称。
  提供缓存名称可让我们对文件进行版本控制，或将数据与 App Shell 分开，
  以便我们能轻松地更新某个数据，而不会影响其他数据。
  缓存打开后，我们便可调用 cache.addAll()，
  这个带有网址列表参数的方法随即从服务器获取文件，并将响应添加到缓存内。
  遗憾的是，cache.addAll() 具有原子性，如果任何一个文件失败，整个缓存步骤也将失败！
  安装完在DevTools-》Application的Service Worker 窗格就能看到
*/
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
/*
  activate 事件会在服务工作线程启动时触发。
  此代码可以确保您的服务工作线程在任何 App Shell 文件更改时更新其缓存。
*/
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        //例如app shell更新，cacheName = 'weatherPWA-step-6-2'，这时会删除之前的6-1
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});
/*
  从缓存提供 App Shell
    服务工作线程提供了拦截 Progressive Web App 发出的请求并在服务工作线程内对它们进行处理的能力。
    这意味着我们可以决定想要如何处理请求，并可提供我们自己的已缓存响应。

    caches.match() 会由内而外对触发抓取事件的网络请求进行评估，并检查以确认它是否位于缓存内。
    它随即使用已缓存版本作出响应，或者利用 fetch 从网络获取一个副本。
    response 通过 e.respondWith() 传回至网页。
*/
self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
