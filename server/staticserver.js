const fs = require("fs");
const http = require("http");
const url = require("url");
const path = require("path");
const mime = require("mime");

const unwin =
  path.sep == "\\"
    ? function(s) {
        return s.replace(/\\/g, "/");
      }
    : function(s) {
        return s;
      };

function StaticServer(options) {
  this.root = unwin(options.root);
  this.handleRequest = this.handleRequest.bind(this);
}

module.exports = StaticServer;

StaticServer.prototype.handleRequest = function(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405; // method not allowed
    res.setHeader("Allow", "GET, HEAD");
    res.setHeader("Content-Length", "0");
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url);
  // Limit the path to current directory to prevent
  // https://en.wikipedia.org/wiki/Directory_traversal_attack
  const sanitizePath = path
    .normalize(parsedUrl.pathname)
    .replace(/^(\.\.[\/\\])+/, "");
  let pathname = path.join(this.root, sanitizePath);
  let fileExtension = path.parse(sanitizePath).ext;

  fs.exists(pathname, exist => {
    if (!exist && fileExtension) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    } else if (!exist) {
      // ship index.html for routes without a file extension e.g. `.js`
      pathname = path.join(this.root, "/index.html");
      fileExtension = ".html";
    } else {
      if (fs.statSync(pathname).isDirectory()) {
        pathname += "/index.html";
        fileExtension = ".html";
      }
    }

    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Server failed reading the file: ${err}.`);
      } else {
        res.setHeader(
          "Content-type",
          mime.getType(fileExtension) || "text/plain"
        );
        res.end(data);
      }
    });
  });
};
