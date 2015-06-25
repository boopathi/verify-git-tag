import child_process from 'child_process';
import fs from 'fs';

let {exec} = child_process;

function exists(path) {
  return new Promise((resolve, reject) => {
    fs.exists(path, exists => exists ? resolve() : reject(new Error('no package.json')));
  });
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, ret) => {
      if (err) return reject(err);
      resolve(ret);
    });
  });
}

function getVersion() {
  let file = './package.json';
  return exists(file)
    .then(() => readFile(file))
    .then(json => JSON.parse(json.toString()).version);
}

export default function({remote = 'origin'} = {}) {

  let command = `git ls-remote --tags ${remote}`;

  return getVersion().then(version => {
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) return reject(err);

        if (stderr.toString().length > 0)
          return reject(new Error(stderr));

        let tags = stdout.toString().split('\n');

        for (let t of tags) {
          let tag = t.split('\t').pop().split('refs/tags/').pop();
          if (tag === 'v' + version || tag === version)
            return resolve({ version, exists: true });
        }

        return resolve({ version, exists: false });
      });
    });
  });
}
