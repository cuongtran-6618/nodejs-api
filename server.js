const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const cors = require('cors');
const PORT = process.env.PORT || 3500;

app.use(logger);


const whiteList = [
  'http://www.fixably.com', 
  'http://127.0.0.1:550', 
  'http:localhost'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1  || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by cors'));
    }
  }, 
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// buildt-in middleware to handle urlendcode data (form data)
app.use(express.urlencoded({ extended: false}));

// buildt-in middleware to handle json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname,'/public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,'views', 'index.html'));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname,'views', 'new-page.html'));
});

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname,'views', '404.html'));
});

app.listen(PORT, () => {
  console.log("listening on port ${PORT}");
});
