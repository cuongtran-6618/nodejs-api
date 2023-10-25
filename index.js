const logEvents = require("./logEvents");
const EventEmitter = require("events");

class EventEmitterExtend extends EventEmitter { };

const eventEmitterExtend = new EventEmitterExtend();

eventEmitterExtend.on("log", (message) => logEvents(message));

setTimeout(() => {
  eventEmitterExtend.emit("log", "Log event emitted");
}, 2000);
