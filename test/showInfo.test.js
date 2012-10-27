var assert = require('assert')
  , net = require('net')
  , haproxystat = require('../lib/haproxystat')
  , _ = require('underscore')
  ;

describe('showstat', function () {

  var SOCKET = '/tmp/haproxyinfo.sock';

  before(function(done){
    var server = net.createServer(function (socket) {
      socket.on('data', function (data) {
        //console.log(data.toString());
        socket.end(mockInfoResponse);
      });

    });

    server.listen(SOCKET, function() { 
      done();
    });
  });

  it ('should get info', function (done) {
    var stats = haproxystat({ socketPath: SOCKET });
    stats.showInfo(function (err, data) {
      assert.equal(null, err);
      assert.equal(20, Object.keys(data).length);
      assert.equal(30984, data.pid)
      assert.equal('HAProxy', data.name)
      assert.equal(4096, data.max_conn)
      done();
    })
  });
});


var mockInfoResponse = "Name: HAProxy\n\
Version: 1.4.18\n\
Release_date: 2011/09/16\n\
Nbproc: 1\n\
Process_num: 1\n\
Pid: 30984\n\
Uptime: 0d 2h01m42s\n\
Uptime_sec: 7302\n\
Memmax_MB: 0\n\
Ulimit-n: 8210\n\
Maxsock: 8210\n\
Maxconn: 4096\n\
Maxpipes: 0\n\
CurrConns: 2\n\
PipesUsed: 0\n\
PipesFree: 0\n\
Tasks: 5\n\
Run_queue: 1\n\
node: haproxyserver-0\n\
description:\n\
"
