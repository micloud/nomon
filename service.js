#!./bin/node
var http = require('http')
	, service = require('./lib/sys/collect')
	, port = process.env.PORT || 1337;
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
	service.collect(function(data) {
		delete data.detail;
		res.end(JSON.stringify(data));
	});
}).listen(port);

console.log('Server start at ' + port);
