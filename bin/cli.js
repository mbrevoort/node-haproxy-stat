#!/usr/bin/env node
var colors = require('colors')
  , haproxystat = require('./lib/haproxystat')
  , command = process.argv[2]
  , socketPath = process.argv[3];

var commands = ['showInfo', 'showStat'];
var usage = ['node cli ', '<command>', '<socket_path>',
            '\n\tcommand      ->  ', commands.join(', '),
            '\n\tsocket_path  ->  /tmp/haproxy.sock (for example)'].join(' ');

if (commands.indexOf(command) < 0) {
  console.error('A valid command is required!'.red + '\nUsage:  ' + usage);
  process.exit(1);
}

if (!socketPath) {
  console.error('socket_path is required!'.red + '\nUsage:  ' + usage);
  process.exit(1);
}

var stats = haproxystat({ socketPath: socketPath });

stats[command](function (err, data) {
  if (err) {
    console.error((err.message || err).red);
    process.exit(1);
  }

  console.log(data);
  process.exit(0);
})
