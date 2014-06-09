#!/usr/bin/env node
var http = require('http');
var service = require('./lib/sys/collect');
var httputil = require('./lib/http/httputil');

//Polling data to server
service.collect(function(data) {
  var opt = {
    host: '211.78.245.109',
    port: '301',
    path: '/addrec',
    method: 'POST'
  };

  httputil.doPostJsonDataForm(opt, 'data', data, function(chunk){
    console.log('[Info]Insert result:%s',chunk); 
  });
});
