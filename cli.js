#!/usr/bin/env node

const fetch = require('./fetch');
const args = process.argv.slice(2);

function error(text) {
  process.stderr.write('\x1B[31m' + text);
}

if (args.length < 1) {
  error('No URL specified.');
} else {
  fetch(args[0], (err, iconUrl) => {
    process.stdout.write(iconUrl || '');
  });
}
