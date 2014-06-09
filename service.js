#!./bin/node
var http = require('http')
	, service = require('./lib/sys/collect');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
	service.collect(function(data) {
		delete data.detail;
		res.end(JSON.stringify(data));
	});
}).listen(443);
