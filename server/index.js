const http = require("http");
const path = require("path");
const port = parseInt(process.argv[2] || 8000, 10);
const ModuleServer = require("./moduleserver");
const StaticServer = require("./staticserver");
const root = path.resolve(".");

var moduleServer = new ModuleServer({ root }).handleRequest;
var staticServer = new StaticServer({ root }).handleRequest;

http
  .createServer((req, res) => {
    moduleServer(req, res) || staticServer(req, res);
  })
  .listen(port);

console.log(`Server available at http://localhost:${port}`);
