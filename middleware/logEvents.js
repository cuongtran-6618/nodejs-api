const { format } = require("date-fns");
const { v4: uuidv4 } = require("uuid");

const fs = require("fs");
const fspromise = require("fs").promises;
const path = require("path");

// Write down the message with time formatting and unique identifier
const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "dd-MM-yyyy")}`;
  const logItem = `${dateTime}\t${uuidv4()}\t${message}`;

  try {
    // creat the folder if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fspromise.mkdir(path.join(__dirname, "../logs"));
    }

    // append the log item to the event log file
    await fspromise.appendFile(path.join(__dirname, "../logs", logName), logItem);
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method} ${req.headers.origin} ${req.url}`, 'reqLog.txt');
  next();
}

module.exports = {logger, logEvents};
