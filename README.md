# verify-git-tag

A simple tool to verify the existence of git remote tag to be the same as the package.json version. To be used while publishing.

## Installation

```sh
npm install verify-git-tag --save-dev
```

## Recommended usage - CLI

Use it with [in-publish](https://github.com/iarna/in-publish).

pacakge.json:

```json
{
  "scripts": {
    "prepublish": "in-publish && verify-git-tag || in-install"
  }
}
```

## NodeJS API - Usage

```js
var verifyGitTag = require('verify-git-tag');
verifyGitTag().then(function(exists) {
  if (exists) console.log('present');
  else console.log('not present');
}).catch(function(err) {
  console.error(err);
});
```
