const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require("./logEvents");
const EventEmitter = require("events");

class Emitter extends EventEmitter { };

// initialize the object 
const myEmitter = new Emitter();

const PORT = process.env.PORT || 3500;

// create the server
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  let requestPath;

  if (req.url === "/" || req.url === "index.html") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    
    requestPath = path.join(__dirname, "views", "index.html");

    fs.readFile(requestPath, (err, data) => {
      if (err) throw err;
      res.end(data);
    });
  } else {
    requestPath = path.join(__dirname, req.url);
  }
});

// config the server to listen on the specified port and host
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));

/*
myEmitter.on("log", (message) => logEvents(message));

setTimeout(() => {
  myEmitter.emit("log", "Log event emitted");
}, 2000);
*/