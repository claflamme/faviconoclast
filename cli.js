#!/usr/bin/env node

const argv = require('minimist');
const fetch = require('./fetch');
const args = argv(process.argv.slice(2));

function error(text) {
  process.stderr.write('\033[31m' + text)
}

if (args._.length < 1) {
  return error('No URL specified.');
}

fetch(args._[0], (err, iconUrl) => {
  process.stdout.write(iconUrl || '');
});
