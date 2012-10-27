var net = require('net')
  ,  _ = require('underscore');

module.exports = function (init) {
  return new HaproxyStat(init);
}

/**
 * HaproxyStat object, newed up indirectly when module function called
 * @constructor
 * @param config {object}
 *        {
 *          socketPath: '/tmp/haproxy.sock'
 *        }
 */
var HaproxyStat = function (config) {
  this.config = _.extend({
    socketPath: '/tmp/haproxy.sock'
  }, config);
};

/**
 * Get the latest stats from haproxy, result of 'show stat' command
 * @async
 *
 * @param {function} callback(error, result) - result is an array
 */
HaproxyStat.prototype.showStat = function(callback) {
  if (!callback || typeof callback !== 'function') { callback = function (){}};
  var result = [];

  var client = net.connect(this.config.socketPath, function (err) {
    if (err) return callback.call(null, err);
    client.end("show stat\n");
  });

  client.on('data', function(data) {
    client.end();

    // the data comes as a buffer so make it a string
    data = data.toString();

    var lines = data.split('\n');

    lines.forEach(function (line) {
      var isNotComment = (line[0] !== '#'),
          isNotBlank = (line !== '');

      if (isNotComment && isNotBlank) {
        var fields = line.split(',');
        var obj = {};
        fields.forEach(function (value, i) {
          if(dict[i])
            obj[dict[i][0]] = value;
        });

        // more detailed status
        obj['check_status'] = {
          code: obj['check_status'],
          description: status[ obj['check_status'] ] || ''
        }

        // more detailed typ
         obj['type'] = types[obj['type']];


        result.push(obj);
      }
    });

    callback.call(null, null, result);
  });
  
};

HaproxyStat.prototype.showInfo = function(callback) {
  if (!callback || typeof callback !== 'function') { callback = function (){}};
  var result = {};

  var client = net.connect(this.config.socketPath, function (err) {
    if (err) return callback.call(null, err);
    client.end("show info\n");
  });

  client.on('data', function(data) {
    client.end();

    // the data comes as a buffer so make it a string
    data = data.toString();

    var lines = data.split('\n');

    lines.forEach(function (line) {
      var isNotBlank = (line !== '');
      if (isNotBlank) {
        var parts = line.split(':');
        result[ infoMap(parts[0]) ] = (parts[1] || '').trim();
      }
    });

    callback.call(null, null, result);
  });
}


/**
 * Return a more readable description for the given stat property
 * @sync
 *
 * @param {string} propName 
 * @return {string} a long description of the stat property
 */
HaproxyStat.prototype.statDescription = function(propName) {
  return dictMap[propName];
}


//
// Internal static mappings
//

// a dictionary of the shortname and description of each status
var i=0, dict = new Array(51);
dict[i++]=['pxname','proxy name'];
dict[i++]=['svname','service name (FRONTEND for frontend, BACKEND for backend, any name for server)'];
dict[i++]=['qcur','current queued requests'];
dict[i++]=['qmax','max queued requests'];
dict[i++]=['scur','current sessions'];
dict[i++]=['smax','max sessions'];
dict[i++]=['slim','sessions limit'];
dict[i++]=['stot','total sessions'];
dict[i++]=['bin','bytes in'];
dict[i++]=['bout','bytes out'];
dict[i++]=['dreq','denied requests'];
dict[i++]=['dresp','denied responses'];
dict[i++]=['ereq','request errors'];
dict[i++]=['econ','connection errors'];
dict[i++]=['eresp','response errors (among which srv_abrt)'];
dict[i++]=['wretr','retries (warning)'];
dict[i++]=['wredis','redispatches (warning)'];
dict[i++]=['status','status (UP/DOWN/NOLB/MAINT/MAINT(via)...)'];
dict[i++]=['weight','server weight (server), total weight (backend)'];
dict[i++]=['act','server is active (server), number of active servers (backend)'];
dict[i++]=['bck','server is backup (server), number of backup servers (backend)'];
dict[i++]=['chkfail','number of failed checks'];
dict[i++]=['chkdown','number of UP->DOWN transitions'];
dict[i++]=['lastchg','last status change (in seconds)'];
dict[i++]=['downtime','total downtime (in seconds)'];
dict[i++]=['qlimit','queue limit'];
dict[i++]=['pid','process id (0 for first instance, 1 for second, ...)'];
dict[i++]=['iid','unique proxy id'];
dict[i++]=['sid','service id (unique inside a proxy)'];
dict[i++]=['throttle','warm up status'];
dict[i++]=['lbtot','total number of times a server was selected'];
dict[i++]=['tracked','id of proxy/server if tracking is enabled'];
dict[i++]=['type', 'type (0=frontend, 1=backend, 2=server, 3=socket)'];
dict[i++]=['rate','number of sessions per second over last elapsed second'];
dict[i++]=['rate_lim','limit on new sessions per second'];
dict[i++]=['rate_max','max number of new sessions per second'];
dict[i++]=['check_status','status of last health check'];
dict[i++]=['check_code','layer5-7 code, if available'];
dict[i++]=['check_duration','time in ms took to finish last health check'];
dict[i++]=['hrsp_1xx','http responses with 1xx code'];
dict[i++]=['hrsp_2xx','http responses with 2xx code'];
dict[i++]=['hrsp_3xx','http responses with 3xx code'];
dict[i++]=['hrsp_4xx','http responses with 4xx code'];
dict[i++]=['hrsp_5xx','http responses with 5xx code'];
dict[i++]=['hrsp_other','http responses with other codes (protocol error)'];
dict[i++]=['hanafail','failed health checks details'];
dict[i++]=['req_rate','HTTP requests per second over last elapsed second'];
dict[i++]=['req_rate_max','max number of HTTP requests per second observed'];
dict[i++]=['req_tot','total number of HTTP requests received'];
dict[i++]=['cli_abrt','number of data transfers aborted by the client'];
dict[i++]=['srv_abrt','number of data transfers aborted by the server (inc. in eresp)'];

// create a map as well to be able to easily lookup the descriptions
var dictMap = {};
dict.forEach(function (it) {
  dictMap[it[0]] = it[1];
});


// table of the short code of statuses and the description
var status = {};
status['UNK']='unknown';
status['INI']='initializing';
status['SOCKERR']='socket error';
status['L4OK']='check passed on layer 4, no upper layers testing enabled';
status['L4TMOUT']='layer 1-4 timeout';
status['L4CON']='layer 1-4 connection problem, for example "Connection refused" (tcp rst) or "No route to host" (icmp)';
status['L6OK']='check passed on layer 6';
status['L6TOUT']='layer 6 (SSL) timeout';
status['L6RSP']='layer 6 invalid response - protocol error';
status['L7OK']='check passed on layer 7';
status['L7OKC']='check conditionally passed on layer 7, for example 404 with disable-on-404';
status['L7TOUT']='layer 7 (HTTP/SMTP) timeout';
status['L7RSP']='layer 7 invalid response - protocol error';
status['L7STS']='layer 7 response error, for example HTTP 5xx';

// a list os types corresponding to the type values 0,1,2,3
var types = ['frontend', 'backend', 'server', 'socket'];

// info name mapping
var infoPropMap = {
  Name:         'name',
  Version:      'version',
  Release_date: 'release_data',
  Nbproc:       'nbproc',
  Process_num:  'process_num',
  Pid:          'pid',
  Uptime:       'uptime',
  Uptime_sec:   'uptime_sec',
  Memmax_MB:    'mem_max_mb',
  "Ulimit-n":   'ulimit_n',
  Maxsock:      'max_sock',
  Maxconn:      'max_conn',
  Maxpipes:     'max_pipes',
  CurrConns:    'current_conns',
  PipesUsed:    'pipes_used',
  PipesFree:    'pipes_free',
  Tasks:        'tasks',
  Run_queue:    'run_queue',
  node:         'node',
  description:  'description'
}

function infoMap(prop) {
  return infoPropMap[prop] || prop;
}

