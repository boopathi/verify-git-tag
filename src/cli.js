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

let successMessage = `[${green}] tag v${version} exists`;
let failureMessage = `[${red}] tag v${version} does not exist
[${red}] ` + `git tag v${version} && git push --tags`;

VerifyGitTag(opts)
  .then(isExist => {
    if (program.verbose)
      console.log(isExist ? successMessage : failureMessage);
    process.exit(!isExist)
  })
  .catch(err => {
    if (DEBUG) console.error(err.stack);
    process.exit(2);
  });
