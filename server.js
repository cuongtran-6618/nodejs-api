const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;

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
