var assert = require('assert')
  , net = require('net')
  , haproxystat = require('../lib/haproxystat')
  , _ = require('underscore')
  ;

describe('showstat', function () {

  var SOCKET = '/tmp/haproxystat.sock';

  before(function(done){
    var server = net.createServer(function (socket) {
      socket.on('data', function (data) {
        //console.log(data.toString());
        socket.end(mockStatsResponse);
      });

    });

    server.listen(SOCKET, function() { 
      done();
    });



  });

  it ('should get stats', function (done) {
    var stats = haproxystat({ socketPath: SOCKET });
    stats.showStat(function (err, data) {
      assert.equal(null, err);
      //console.log(data);
      assert.equal(12, data.length);

      // spot check
      var agentFe = data[6];
      assert.equal('agent', agentFe.pxname);
      assert.equal('FRONTEND', agentFe.svname);
      assert.equal('frontend', agentFe.type);
      assert.equal('2000', agentFe.slim); // session limit
      assert.equal('OPEN', agentFe.status); 

      var agentServer = data[9];
      assert.equal('agent', agentServer.pxname);
      assert.equal('agent_10.10.2.180:8080', agentServer.svname);
      assert.equal('server', agentServer.type);
      assert.equal('UP', agentServer.status); 
      assert.equal('L4OK', agentServer.check_status.code); 
      assert.equal('check passed on layer 4, no upper layers testing enabled', agentServer.check_status.description); 

      done();
    })
  });
});


var mockStatsResponse = "# pxname,svname,qcur,qmax,scur,smax,slim,stot,bin,bout,dreq,dresp,ereq,econ,eresp,wretr,wredis,status,weight,act,bck,chkfail,chkdown,lastchg,downtime,qlimit,pid,iid,sid,throttle,lbtot,tracked,type,rate,rate_lim,rate_max,check_status,check_code,check_duration,hrsp_1xx,hrsp_2xx,hrsp_3xx,hrsp_4xx,hrsp_5xx,hrsp_other,hanafail,req_rate,req_rate_max,req_tot,cli_abrt,srv_abrt, \n\
stats,FRONTEND,,,0,0,2000,0,0,0,0,0,0,,,,,OPEN,,,,,,,,,1,1,0,,,,0,0,0,0,,,,0,0,0,0,0,0,,0,0,0,,,\n\
stats,BACKEND,0,0,0,0,2000,0,0,0,0,0,,0,0,0,0,UP,0,0,0,,0,99,0,,1,1,0,,0,,1,0,,0,,,,0,0,0,0,0,0,,,,,0,0,\n\
ldap,FRONTEND,,,0,0,2000,0,0,0,0,0,0,,,,,OPEN,,,,,,,,,1,2,0,,,,0,0,0,0,,,,,,,,,,,0,0,0,,,\n\
ldap,10.10.2.176,0,0,0,0,,0,0,0,,0,,0,0,0,0,no check,1,1,0,,,,,,1,2,1,,0,,2,0,,0,,,,,,,,,,0,,,,0,0,\n\
ldap,10.10.4.185,0,0,0,0,,0,0,0,,0,,0,0,0,0,no check,1,1,0,,,,,,1,2,2,,0,,2,0,,0,,,,,,,,,,0,,,,0,0,\n\
ldap,BACKEND,0,0,0,0,2000,0,0,0,0,0,,0,0,0,0,UP,2,2,0,,0,99,0,,1,2,0,,0,,1,0,,0,,,,,,,,,,,,,,0,0,\n\
agent,FRONTEND,,,1,1,2000,2,0,212,0,0,1,,,,,OPEN,,,,,,,,,1,3,0,,,,0,0,0,1,,,,0,0,0,1,0,0,,0,1,1,,,\n\
ecxd,ecxd_static.ecollege.com:80,0,0,0,0,,0,0,0,,0,,0,0,0,0,UP,1,1,0,0,0,99,0,,1,4,1,,0,,2,0,,0,L4OK,,43,0,0,0,0,0,0,0,,,,0,0,\n\
ecxd,BACKEND,0,0,0,0,0,0,0,0,0,0,,0,0,0,0,UP,1,1,0,,0,99,0,,1,4,0,,0,,1,0,,0,,,,0,0,0,0,0,0,,,,,0,0,\n\
agent,agent_10.10.2.180:8080,0,0,0,0,,0,0,0,,0,,0,0,0,0,UP,1,1,0,0,0,99,0,,1,5,1,,0,,2,0,,0,L4OK,,0,0,0,0,0,0,0,0,,,,0,0,\n\
agent,agent_10.10.2.125:8080,0,0,0,0,,0,0,0,,0,,0,0,0,0,UP,1,1,0,0,0,99,0,,1,5,2,,0,,2,0,,0,L4OK,,0,0,0,0,0,0,0,0,,,,0,0,\n\
agent,BACKEND,0,0,0,0,0,0,0,0,0,0,,0,0,0,0,UP,2,2,0,,0,99,0,,1,5,0,,0,,1,0,,0,,,,0,0,0,0,0,0,,,,,0,0,\n\
";