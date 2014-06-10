var os = require('os')
  , util = require('util')
  , qs = require('querystring')
  , exec = require('child_process').exec
  //, _ = require('underscore');

exports.collect = function(callback){
  var datainfo = {};
  //Log details
  datainfo.detail={};
  datainfo.detail.cpus = os.cpus();
  datainfo.detail.type = os.type();
  datainfo.detail.release = os.release();
  datainfo.detail.arch = os.arch();
  datainfo.detail.platform = os.platform();

  //Cpu data
  if(os.platform().indexOf('win') < 0) {
    var loadavg = os.loadavg();
    datainfo.cpu = {
      "p1": loadavg[0]*100,
      "p2": loadavg[1]*100
    }
    if(datainfo.cpu && datainfo.mem && datainfo.disk)
      callback(datainfo);
  } else {
    exec('wmic cpu get loadpercentage', function(err, stdo, stde){
      var lines = stdo.split('\n');
      var sum = 0;
      var cnt = 0;
      var max = 0;
      lines.forEach(function(v){
        v = v.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        if(cnt > 0 && v.length > 0){
          sum += parseInt(v);
          if(parseInt(v) > max) max = parseInt(v);
        }
        cnt++;
      });
      var avg = sum/(cnt+1)
      console.log('[out]sum=%s,avg=%s,cnt=%s',sum, avg, cnt);
      datainfo.cpu = {
        "p1": avg, "p2": max
      }
      if(datainfo.cpu && datainfo.mem && datainfo.disk) {
        console.log('try to callback...');
        callback(datainfo);
      }
    });
  }

  //Memory data
  var free = os.freemem()/1024/1024;
  var total = os.totalmem()/1024/1024;
	var usage = 1 - free/total;
  datainfo.mem = {
    "p1": total-free,
    "p2": total,
    "usage": usage
  };
  //datainfo.platform = os.platform();

  //Disk data
  var cmd = 'df -Tk'
  switch(os.platform()){
  case 'sunos':
    cmd += '| grep zfs';
    cmd += '| awk \'{print $1,$2,$3,$4}\'';
    break;
  case 'linux':
    cmd += '| grep ext';
    cmd += '| awk \'{print $1,$2,$3,$4}\'';
    break;
  case 'win32':
    cmd = 'fsutil volume diskfree ';
    break;
  case 'solaris':
    cmd += '| grep zfs';
    cmd += '| awk \'{print $1,$2,$3,$4}\'';
    break;
  default:
    cmd += '| grep zfs';
    cmd += '| awk \'{print $1,$2,$3,$4}\'';
    break;
  }
  console.log('[CMD]' + cmd);
  if(os.platform().indexOf('win') < 0)
  exec(cmd, function(err, stdo, stde) {
    if(err) console.log(JSON.stringify(err));
    var lines = stdo.split('\n');
    var t_size = 0;
    var t_used = 0;
    //console.log('lines:' + lines);
		if(!datainfo['disk']) datainfo['disk'] = [];
    lines.forEach(function(v){
      if(v.length > 0) { 
        console.log('v:' + v);
        var size,used = '';
				var diskname = '';
        if(v.split(' ')[0] == 'zfs') { 
          size = v.split(' ')[1];
          used = v.split(' ')[2];
					diskname = v.split(' ')[0];
        } else {
          size = v.split(' ')[2];
          used = v.split(' ')[3];
					diskname = v.split(' ')[0];
        }
        t_size = (t_size) + parseInt(size);
        t_used = (t_used) + parseInt(used);
        console.log('%s::%s', t_size, t_used);
				datainfo.disk.push({
					"name": diskname,
					"p1": t_used,
					"p2": t_size,
					"usage": t_used/t_size
				});

      }
    });

        
    datainfo.uptime = os.uptime();
    datainfo.hostname = os.hostname();
    datainfo.ts = new Date().getTime();
    if(datainfo.cpu && datainfo.mem && datainfo.disk)
    	callback(datainfo);
  });
  else {
    getWin32DiskUsage(function(u,t){
      datainfo.disk.push({
        "p1": u,
        "p2": t
      });
   
      datainfo.uptime = os.uptime();
      datainfo.hostname = os.hostname();
      datainfo.ts = new Date().getTime();
      if(datainfo.cpu && datainfo.mem && datainfo.disk)
        callback(datainfo);
    });
  }
};

function getWin32DiskUsage(callback) {
  var _used = 0;
  var _total = 0;
  getWin32DiskSize('c:', function(cused, ctotal) {
    _used += (cused ? cused : 0);
    _total += (ctotal ? ctotal : 0);
    getWin32DiskSize('d:', function(dused, dtotal) {
      _used += (dused ? dused : 0);
      _total += (dtotal ? dtotal : 0);
      callback(_used, _total);
    });
  });
}

function getWin32DiskSize(disk, callback){
  var cmd = 'fsutil volume diskfree ' + disk;
  
  exec(cmd, function(err, stdo, stde) {
    var lines = stdo.split('\n');
    var out = new Array();
    lines.forEach(function(line){
      var str = line.split(':')[1];
      if(str != null && str != '')
      out.push(str);
    });
    var v1 = out[0];
    var v2 = out[1];
    var used = (parseInt(v2) - parseInt(v1))/1024;
    var total = parseInt(v2)/1024;
  
    console.log('[out]used:%s, total:%s', used, total);
    callback(used, total);
  }); 
}

exports.formatUptime = function(ts){
  if(!ts || ts == null){
    ts = os.uptime();
  }
  var d = Math.floor(ts/24/60/60);
  var h = Math.floor(ts/24/60/60%1*24);
  var m = Math.floor(ts/24/60/60%1*24%1*60);
  return util.format('%s days, %s:%s',d,h,m);
}

