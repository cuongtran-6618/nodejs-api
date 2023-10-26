const logEvents = require("./logEvents");
const EventEmitter = require("events");

class Emitter extends EventEmitter { };

const myEmitter = new Emitter();

myEmitter.on("log", (message) => logEvents(message));

setTimeout(() => {
  myEmitter.emit("log", "Log event emitted");
}, 2000);
