var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('proxy-mirror.key', 'utf8');
var certificate = fs.readFileSync('proxy-mirror.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();

app.get('/*', function (req, res) {
    proxy.web(req, res, {target: 'https://www.google.com'});
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);

console.log('Listening...');
