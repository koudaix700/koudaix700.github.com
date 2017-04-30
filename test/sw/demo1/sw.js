console.log("success");
console.log(this);
self.addEventListener('fetch',event => {
    event.respondWith(
        new Response("World");
    );
})
