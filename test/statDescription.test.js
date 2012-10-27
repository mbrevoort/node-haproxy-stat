var assert = require('assert')
  , net = require('net')
  , haproxystat = require('../lib/haproxystat')
  , _ = require('underscore')
  ;

describe('showstat', function () {

  var SOCKET = '/tmp/haproxystat.sock';

  it ('should get property descriptions', function (done) {
    var stats = haproxystat({ socketPath: SOCKET });
    assert.equal('proxy name', stats.statDescription('pxname'))
    assert.equal('number of data transfers aborted by the server (inc. in eresp)', stats.statDescription('srv_abrt'))
    done();
  });
});

