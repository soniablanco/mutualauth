const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
var options = { 
  key: fs.readFileSync('/certificates/server-key.pem'), 
  cert: fs.readFileSync('/certificates/server-crt.pem'), 
  ca: fs.readFileSync('/certificates/ca-crt.pem'), 
    requestCert: true, 
    rejectUnauthorized: true
}; 
https.createServer(options, function (req, res) { 
  


  console.log(__dirname)
  console.log(new Date()+' '+ 
  req.connection.remoteAddress+' '+ 
  req.socket.getPeerCertificate().subject.CN+' '+ 
  req.method+' '+req.url); 


  if (req.url==='/json'){
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ value: "my value" }));
    return;
  }

  const parsedUrl = url.parse(req.url);
  // extract URL path
  let pathname = path.join(__dirname, req.url)
  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
  const ext = path.parse(pathname).ext;
  // maps file extention to MIME typere
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
  };


  fs.exists(pathname, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    // if is a directory search for index file matching the extention
    if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });




}).listen(4433);