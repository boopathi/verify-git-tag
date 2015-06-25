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

### CLI Options

#### `-r | --remote <remote>`

Default remote is origin. Use this to specify remote to fetch tags from

```sh
$ verify-git-tag -r upstream
```

#### `-v | --verbose`

On success,

```sh
$ verify-git-tag -v
[verify-git-tag] tag v0.1.0 exists
```

On failure,

```sh
$ verify-git-tag -v
[verify-git-tag] tag v0.1.1 does not exist
[verify-git-tag] git tag v0.1.1 && git push --tags
```

## NodeJS API - Usage

Returns a promise that resolves with `{ version, exists }`

### Example

```js
var verifyGitTag = require('verify-git-tag');
verifyGitTag({
  remote: 'upstream' // default is origin if not specified
}).then(function(result) {
  console.log(result);
  // => result.version: <String> version from package.json
  // => result.exists: <Boolean> git tag exists
}).catch(function(err) {
  console.error(err);
});
```
