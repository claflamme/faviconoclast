#!/usr/bin/env node

const argv = require('minimist');
const fetch = require('./fetch');
const args = argv(process.argv.slice(2));

function error(text) {
  process.stderr.write('\x1B[31m' + text);
}

if (args._.length < 1) {
  error('No URL specified.');
} else {
  fetch(args._[0], (err, iconUrl) => {
    process.stdout.write(iconUrl || '');
  });
}
