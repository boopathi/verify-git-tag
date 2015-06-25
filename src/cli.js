#!/usr/bin/env node

import VerifyGitTag from '../';
import program from 'commander';
import {version, name} from '../package.json';
import 'colors';

let DEBUG = false;

if (typeof process.env.DEBUG !== 'undefined')
  DEBUG = ['true', '1'].indexOf(process.env.DEBUG.toString().toLowerCase()) !== -1;

program
  .version(version)
  .option('-v, --verbose', 'Verbose output')
  .option('-r, --remote <remote>', 'git remote')
  .parse(process.argv);

let opts = {
  remote: program.remote
};

let green = name.green;
let red = name.red;

VerifyGitTag(opts)
  .then(result => {
    let successMsg = `[${green}] tag v${result.version} exists`;
    let failureMsg = `[${red}] tag v${result.version} does not exist
[${red}] git tag v${result.version} && git push --tags`;

    if (program.verbose)
      console.log(result.exists ? successMsg : failureMsg);
    process.exit(!result.exists)
  })
  .catch(err => {
    if (DEBUG) console.error(err.stack);
    process.exit(2);
  });
