const fs = require("fs");
const http = require("http");
const url = require("url");
const path = require("path");
const port = parseInt(process.argv[2] || 8000, 10);

const mimeType = {
  ".ico": "image/x-icon",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".eot": "appliaction/vnd.ms-fontobject",
  ".ttf": "aplication/font-sfnt"
};

http
  .createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    const parsedUrl = url.parse(req.url);
    // Limit the path to current directory to prevent
    // https://en.wikipedia.org/wiki/Directory_traversal_attack
    const sanitizePath = path
      .normalize(parsedUrl.pathname)
      .replace(/^(\.\.[\/\\])+/, "");
      let pathname = path.join(__dirname, sanitizePath);
    let fileExtension = path.parse(sanitizePath).ext;

    fs.exists(pathname, exist => {
      if (!exist && fileExtension) {
        res.statusCode = 404;
        res.end(`File ${pathname} not found!`);
        return;
      else if (!exist) {
        // ship index.html for routes without a file extension e.g. `.js`
        pathname = path.join(__dirname, "/index.html");
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
            mimeType[fileExtension] || "text/plain"
          );
          res.end(data);
        }
      });
    });
  })
  .listen(port);

console.log(`Server available at http://localhost:${port}`);
