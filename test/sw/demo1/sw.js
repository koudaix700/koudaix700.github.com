console.log("success");
console.log(this);
self.addEventListener('fetch',function(event) {
    return event.respondWith(
        new Response("World")
    );
})
