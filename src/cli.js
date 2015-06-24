#!/usr/bin/env node

import VerifyGitTag from '../';
let DEBUG = false;

if (typeof process.env.DEBUG !== 'undefined')
  DEBUG = ['true', '1'].indexOf(process.env.DEBUG.toString().toLowerCase()) !== -1;

VerifyGitTag()
  .then(isExist => process.exit(!isExist))
  .catch(err => {
    if (DEBUG) console.error(err.stack);
    process.exit(2);
  });
