const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = require("./logEvents");
const EventEmitter = require("events");
const { da } = require("date-fns/locale");

class Emitter extends EventEmitter {}

// initialize the object
const myEmitter = new Emitter();

const PORT = process.env.PORT || 3500;

// create the server
const server = http.createServer((req, res) => {
  const extention = path.extname(req.url);
  let contentType = getFileExtention(extention);

  const isHtmlFile = contentType === "text/html";
  const indexPagePath = path.join(__dirname, "views", "index.html");
  let filePath = getFilePath(req, isHtmlFile, indexPagePath);

  console.log(filePath);

  if (!extention && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    serveFile(filePath, contentType, res);
  } else {
    const filePathBase = path.parse(filePath).base;

    switch (filePathBase) {
      case "old-page.html":
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        serveFile(path.join(__dirname, "views", "404.html"), contentType, res);
    }
  }
});

const serveFile = async (filePath, contentType, response) => {
  try {
    const data = await fsPromises.readFile(filePath, "utf-8");
    response.writeHead(200, { "Content-Type": contentType });
    response.end(data);
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.end();
  }
};

const getFilePath = (req, isHtmlFile, indexPagePath) => {
  path.join(__dirname, "views", "index.html");
  return !isHtmlFile
    ? path.join(__dirname, req.url)
    : req.url === "/" || req.url.slice(-1) === "/"
    ? indexPagePath
    : path.join(__dirname, "views", req.url);
};

const getFileExtention = (extention) => {
  let contentType;
  switch (extention) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }
  return contentType;
};

// config the server to listen on the specified port and host
server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);
