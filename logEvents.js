const { format } = require("date-fns");
const { v4: uuidv4 } = require("uuid");

const fs = require("fs");
const fspromise = require("fs").promises;
const path = require("path");

const logEvents = async (message) => {
  const dateTime = `${format(new Date(), "dd-MM-yyyy")}`;
  const logItem = `${dateTime}\t${uuidv4()}\t${message}`;
  console.log(logItem);

  try {
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fspromise.mkdir(path.join(__dirname, "logs"));
    }

    await fspromise.appendFile(
      path.join(__dirname, "logs", "eventLog.txt"),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = logEvents;
