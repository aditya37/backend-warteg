// import package http
const http = require('http');

// import file app.js
const app = require('./api/app');

// environment variable
const port = process.env.PORT || 3000;

// membuat server
const server = http.createServer(app);

// listening server
server.listen(port,() =>{
    console.log("Oke Server Berjalan");
});


