const http=require("http");

const server=http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('Hello from Node.js\n');
})

server.listen(3000,()=>{
    console.log('Server running at http://localhost:3000/');
});

const express = require("express");

const app=express();

app.get("/",(req,res)=>{
    res.send("Hello from Express.js");
})
app.get("/users",(req,res)=>{
    res.json([{name:"Krishna"},{name:"Rama"}]);
})

app.listen(4000,()=>{
    console.log("Express server running at http://localhost:4000/");
})


