console.log("success");
console.log(this);
self.addEventListener('fetch',function(event) {
    event.respondWith(
        fetch(event.request).then(function(response){
            if(response.status === 404){
                return new Response("World");
            }else{
                //返回缓存的值
                return response;
            }
        })
    );
})
