const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const PORT = process.env.PORT || 3500;

app.use(logger);

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
