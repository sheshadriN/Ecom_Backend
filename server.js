const http = require('http')

const server = http.createServer((req,res)=>{
    res.writeHead(200,{'x-content-type':'text/plain'});
    res.end('the request is processed');
})


server.listen(2000,()=>{
    console.log("server is running");
})