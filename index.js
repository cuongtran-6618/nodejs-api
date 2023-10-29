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

myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));
const PORT = process.env.PORT || 3500;

// create the server
const server = http.createServer((req, res) => {
  myEmitter.emit("log", `${req.url}\t${req.method}\n`, `reqLog.txt`);
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

/**
 * Read the contents of the file and return the contents in the response
 * @param {*} filePath
 * @param {*} contentType
 * @param {*} response
 */
const serveFile = async (filePath, contentType, response) => {
  try {
    // if it is not an inmage file then use uft-8
    let rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes("image") ? "utf-8" : ""
    );

    const isJsonData = contentType === "application/json";
    const data = isJsonData ? JSON.stringify(JSON.parse(rawData)) : rawData;

    response.writeHead(getStatusBaseOnFilepath(filePath), {
      "Content-Type": contentType,
    });

    response.end(data);
  } catch (error) {
    console.log(error);
    myEmitter.emit("log", `${error.name}: ${error.message}`, `errorLog.txt`);
    response.statusCode = 500;
    response.end();
  }
};

/**
 *  kinde of router
 * @param {*} req
 * @param {*} isHtmlFile
 * @param {*} indexPagePath
 * @returns
 */
const getFilePath = (req, isHtmlFile, indexPagePath) => {
  path.join(__dirname, "views", "index.html");
  return !isHtmlFile
    ? path.join(__dirname, req.url)
    : req.url === "/" || req.url.slice(-1) === "/"
    ? indexPagePath
    : path.join(__dirname, "views", req.url);
};

const getStatusBaseOnFilepath = (filePath) => {
  if (filePath.includes("404.html")) {
    return 404;
  } else {
    return 200;
  }
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
