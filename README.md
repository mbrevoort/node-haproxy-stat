
Simplify getting info an stats from a local haproxy stat file socket.

[![build status](https://secure.travis-ci.org/mbrevoort/node-haproxy-stat.png)](http://travis-ci.org/mbrevoort/node-haproxy-stat)

## Install

	npm install haproxy-stat

## Module Usage

	var haproxystat = require('haproxy-stat');
	var hastat = haproxystat({ socketPath: '/tmp/haproxy.sock' });

### Show Info

Get basic info from HAProxy.

	hastat.showInfo(function (err, data) {
		console.log(data);
	});

`data` is an object with the following properties:

	{
		name: 'HAProxy',
		version: '1.4.18',
		release_data: '2011/09/16',
		nbproc: '1',
		process_num: '1',
		pid: '30984',
		uptime: '0d 2h01m42s',
		uptime_sec: '7302',
		mem_max_mb: '0',
		ulimit_n: '8210',
		max_sock: '8210',
		max_conn: '4096',
		max_pipes: '0',
		current_conns: '2',
		pipes_used: '0',
		pipes_free: '0',
		tasks: '5',
		run_queue: '1',
		node: 'haproxyserver-0',
		development: '' 
	}	
	

### Show Stats

Get data from HAProxy stats via `show stats` command. Detailed date described [here](http://code.google.com/p/haproxy-docs/wiki/StatisticsMonitoring).

	hastat.showStat(function (err, data) {
		console.log(data);
	});

`data` is an array of objects like the following:

	[ 
		{ 
		  	pxname: 'ldap',
		    svname: 'FRONTEND',
		    qcur: '',
		    qmax: '',
		    scur: '0',
		    smax: '0',
		    slim: '2000',
		    stot: '0',
		    bin: '0',
		    bout: '0',
		    dreq: '0',
		    dresp: '0',
		    ereq: '0',
		    econ: '',
		    eresp: '',
		    wretr: '',
		    wredis: '',
		    status: 'OPEN',
		    weight: '',
		    act: '',
		    bck: '',
		    chkfail: '',
		    chkdown: '',
		    lastchg: '',
		    downtime: '',
		    qlimit: '',
		    pid: '1',
		    iid: '2',
		    sid: '0',
		    throttle: '',
		    lbtot: '',
		    tracked: '',
		    type: 'frontend',
		    rate: '0',
		    rate_lim: '0',
		    rate_max: '0',
		    check_status: { 
		    	code: '', 
		    	description: '' 
		    },
		    check_code: '',
		    check_duration: '',
		    hrsp_1xx: '',
		    hrsp_2xx: '',
		    hrsp_3xx: '',
		    hrsp_4xx: '',
		    hrsp_5xx: '',
		    hrsp_other: '',
		    hanafail: '',
		    req_rate: '0',
		    req_rate_max: '0',
		    req_tot: '0',
		    cli_abrt: '',
		    srv_abrt: '' 
		},
		{ 
		  	pxname: 'agent',
		    svname: 'agent_10.10.2.125:8080',
		    qcur: '0',
		    qmax: '0',
		    scur: '0',
		    smax: '0',
		    slim: '',
		    stot: '0',
		    bin: '0',
		    bout: '0',
		    dreq: '',
		    dresp: '0',
		    ereq: '',
		    econ: '0',
		    eresp: '0',
		    wretr: '0',
		    wredis: '0',
		    status: 'UP',
		    weight: '1',
		    act: '1',
		    bck: '0',
		    chkfail: '0',
		    chkdown: '0',
		    lastchg: '99',
		    downtime: '0',
		    qlimit: '',
		    pid: '1',
		    iid: '5',
		    sid: '2',
		    throttle: '',
		    lbtot: '0',
		    tracked: '',
		    type: 'server',
		    rate: '0',
		    rate_lim: '',
		    rate_max: '0',
		    check_status: { 
		    	code: 'L4OK',
		    	description: 'check passed on layer 4, no upper layers testing enabled' 
		    },
		    check_code: '',
		    check_duration: '0',
		    hrsp_1xx: '0',
		    hrsp_2xx: '0',
		    hrsp_3xx: '0',
		    hrsp_4xx: '0',
		    hrsp_5xx: '0',
		    hrsp_other: '0',
		    hanafail: '0',
		    req_rate: '',
		    req_rate_max: '',
		    req_tot: '',
		    cli_abrt: '0',
		    srv_abrt: '0' 
		},
  		{ 
		  	pxname: 'agent',
		    svname: 'BACKEND',
		    qcur: '0',
		    qmax: '0',
		    scur: '0',
		    smax: '0',
		    slim: '0',
		    stot: '0',
		    bin: '0',
		    bout: '0',
		    dreq: '0',
		    dresp: '0',
		    ereq: '',
		    econ: '0',
		    eresp: '0',
		    wretr: '0',
		    wredis: '0',
		    status: 'UP',
		    weight: '2',
		    act: '2',
		    bck: '0',
		    chkfail: '',
		    chkdown: '0',
		    lastchg: '99',
		    downtime: '0',
		    qlimit: '',
		    pid: '1',
		    iid: '5',
		    sid: '0',
		    throttle: '',
		    lbtot: '0',
		    tracked: '',
		    type: 'backend',
		    rate: '0',
		    rate_lim: '',
		    rate_max: '0',
		    check_status: { 
		    	code: '', 
		    	description: '' 
		    },
		    check_code: '',
		    check_duration: '',
		    hrsp_1xx: '0',
		    hrsp_2xx: '0',
		    hrsp_3xx: '0',
		    hrsp_4xx: '0',
		    hrsp_5xx: '0',
		    hrsp_other: '0',
		    hanafail: '',
		    req_rate: '',
		    req_rate_max: '',
		    req_tot: '',
		    cli_abrt: '0',
		    srv_abrt: '0' 
		} 
    ]

	
	var longDescrption = hastat.statDescription(property);

like:

	var longDescrption = hastat.statDescription('rate');
	console.log(longDescription);

results in:

	number of sessions per second over last elapsed second


## CLI 

	./node_modueles/.bin/haproxystat

or if installed globally:

	npm install -g haproxy-stat
	haproxystat

Usage:

	Usage:  node cli  <command> <socket_path> 
		command      ->   showInfo, showStat 
		socket_path  ->  /tmp/haproxy.sock (for example)
