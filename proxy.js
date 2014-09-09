var httpProxy = require('http-proxy');
var proxyServer = httpProxy.createServer(function (req, res, proxy) {
    var hostNameHeader = req.headers.host,
        hostAndPort = hostNameHeader.split(':'),
        host = hostAndPort[0],
        port = parseInt(hostAndPort[1]) || 80;
    proxy.proxyRequest(req, res, {
        host: host,
        port: port
    });
});
proxyServer.listen(8888);

return;

var httpProxy = require('http-proxy'),
    fs = require('fs'),
    https = require('https'),
    net = require('net'),
    httpsOptions = {
        key: fs.readFileSync('proxy-mirror.key', 'utf8'),
        cert: fs.readFileSync('proxy-mirror.crt', 'utf8')
    };

var proxyServer = httpProxy.createServer(function (req, res, proxy) {
    console.log('will proxy request', req.url);
    var hostNameHeader = req.headers.host,
        hostAndPort = hostNameHeader.split(':'),
        host = hostAndPort[0],
        port = parseInt(hostAndPort[1]) || 80;
    proxy.proxyRequest(req, res, {
        host: host,
        port: port
    });
});

proxyServer.addListener('connect', function (request, socketRequest, bodyhead) {
    var srvSocket = net.connect(8889, 'localhost', function () {
        socketRequest.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        srvSocket.write(bodyhead);
        srvSocket.pipe(socketRequest);
        socketRequest.pipe(srvSocket);
    });
});

var fakeHttps = https.createServer(httpsOptions, function (req, res) {
    var hostNameHeader = req.headers.host,
        hostAndPort = hostNameHeader.split(':'),
        host = hostAndPort[0],
        port = parseInt(hostAndPort[1]) || 443;

    proxyServer.proxy.proxyRequest(req, res, {
        host: host,
        port: port,
        changeOrigin: true,
        target: {
            https: true
        }
    });
});

proxyServer.listen(8888);
fakeHttps.listen(8889);
