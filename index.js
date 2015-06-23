#!/usr/bin/env node

var DEBUG = true;

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

var libgit2 = FFI.Library('/Users/boopathi.rajaa/workspace/libgit2/build/libgit2.dylib', {
  'git_libgit2_init': ['int', []],
  'git_repository_open': [ 'int', [RepoPtrPtr, 'string']],
  'git_remote_ls': ['int', [RemoteHeadPtrPtrPtr, SizeTPtr, RemotePtr]],
  'git_remote_lookup': ['int', [RemotePtrPtr, RepoPtr, 'string']],
});

var err;

libgit2.git_libgit2_init();

var repoPtrPtr = ref.alloc(RepoPtrPtr);
err = libgit2.git_repository_open(repoPtrPtr, path.resolve('./'));
if (err) return console.log('failed repo open');
if (DEBUG) console.log('open success');

var repoPtr = repoPtrPtr.deref();
var repo = repoPtr.deref();

var remotePtrPtr = ref.alloc(RemotePtrPtr);
err = libgit2.git_remote_lookup(remotePtrPtr, repoPtr, 'origin')
if (err) return console.log('failed to lookup remote');
if (DEBUG) console.log('remote lookup success');

var remotePtr = remotePtrPtr.deref();
var remote = remotePtr.deref();

var remoteHeadPtrPtrPtr = ref.alloc(RemoteHeadPtrPtrPtr);
var sizePtr = ref.alloc(SizeTPtr);
err = libgit2.git_remote_ls(remoteHeadPtrPtrPtr, sizePtr, remotePtr);
if (err) return console.log('remote ls failed');
if (DEBUG) console.log('remote ls success');

console.log('success');
