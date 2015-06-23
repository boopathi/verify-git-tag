#!/usr/bin/env node

var DEBUG = true;
var GIT_REMOTE_CALLBACKS_VERSION=1;
var GIT_DIRECTION_FETCH=0;
var GIT_DIRECTION_PUSH=1;

var FFI = require('ffi');
var ref = require('ref');
var path = require('path');
var Struct = require('ref-struct');

var Repo = ref.types.void;
var RepoPtr = ref.refType(Repo);
var RepoPtrPtr = ref.refType(RepoPtr);

var Remote = ref.types.void;
var RemotePtr = ref.refType(Remote);
var RemotePtrPtr = ref.refType(RemotePtr);

var Cred = ref.types.void;
var CredPtr = ref.refType(Cred);
var CredPtrPtr = ref.refType(CredPtr);

var Void = ref.types.void;
var VoidPtr = ref.refType(Void);

var CredCallbackFn = FFI.Function('int', [CredPtrPtr, 'string', 'string', 'int', VoidPtr]);
var RemoteCallbacks = Struct();
RemoteCallbacks.defineProperty('credentials', CredCallbackFn);
var RemoteCallbacksPtr = ref.refType(RemoteCallbacks);

// var RemoteHead = Struct({
//   local: 'int',
//   git_oid: ref.types.void,
//   name: 'string',
//   symref_target: 'string'
// });

var RemoteHead = ref.types.void;
var RemoteHeadPtr = ref.refType(RemoteHead);
var RemoteHeadPtrPtr = ref.refType(RemoteHeadPtr);
var RemoteHeadPtrPtrPtr = ref.refType(RemoteHeadPtrPtr);

var SizeT = ref.types.size_t;
var SizeTPtr = ref.refType(SizeT);

var libgit2 = FFI.Library(
  path.join('..','libgit2','build','libgit2.dylib'), {
  'git_libgit2_init': ['int', []],
  'git_repository_open': [ 'int', [RepoPtrPtr, 'string']],
  'git_remote_ls': ['int', [RemoteHeadPtrPtrPtr, SizeTPtr, RemotePtr]],
  'git_remote_lookup': ['int', [RemotePtrPtr, RepoPtr, 'string']],
  'git_remote_connect': ['int', [RemotePtr, 'int', RemoteCallbacksPtr]],
  'git_remote_init_callbacks': ['int', [RemoteCallbacksPtr, 'int']],
  'git_cred_ssh_key_new': ['int', [CredPtrPtr, 'string', 'string', 'string', 'string']],
});

var err;

// Global init for libgit2
libgit2.git_libgit2_init();

// Open the repository
var repoPtrPtr = ref.alloc(RepoPtrPtr);
err = libgit2.git_repository_open(repoPtrPtr, path.resolve('./'));
if (err) return console.log('failed repo open');
if (DEBUG) console.log('open success');

var repoPtr = repoPtrPtr.deref();
var repo = repoPtr.deref();

// Lookup the remote for origin
var remotePtrPtr = ref.alloc(RemotePtrPtr);
err = libgit2.git_remote_lookup(remotePtrPtr, repoPtr, 'origin')
if (err) return console.log('failed to lookup remote');
if (DEBUG) console.log('remote lookup success');

var remotePtr = remotePtrPtr.deref();
var remote = remotePtr.deref();

// create creds
var credentialsCallbackFn = FFI.Callback(
  'int',
  [CredPtrPtr, 'string', 'string', 'int', VoidPtr],
  function (cred, url, username, allowed_types, payload) {
    console.log(username);
    return litbgit2.git_cred_ssh_key_new(
      cred,
      username,
      path.join(process.env.HOME, '.ssh', 'id_rsa.pub'),
      path.join(process.env.HOME, '.ssh', 'id_rsa'),
      '' // passphrase
    );
  }
);

var callbacks = new RemoteCallbacks({
  credentials: credentialsCallbackFn
});
var callbacksPtr = callbacks.ref();
// err = libgit2.git_remote_init_callbacks(callbacksPtr, GIT_REMOTE_CALLBACKS_VERSION);
// if (err) return console.log('callback init failed');
// console.log('callbacks init successful')

// connect
err = libgit2.git_remote_connect(remotePtr, GIT_DIRECTION_FETCH, callbacksPtr);
if (err) return console.log(err, 'failed to connect');
if (DEBUG) console.log('connection successful');

var remoteHeadPtrPtrPtr = ref.alloc(RemoteHeadPtrPtrPtr);
var sizePtr = ref.alloc(SizeTPtr);
libgit2.git_remote_ls.async(remoteHeadPtrPtrPtr, sizePtr, remotePtr, function(err, res) {
  if(err) throw err;
  console.log("Result =", res);
});

console.log('success');
