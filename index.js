#!/usr/bin/env node

var DEBUG = true;

var FFI = require('ffi');
var ref = require('ref');
var path = require('path');

var Repo = ref.types.void;
var RepoPtr = ref.refType(Repo);
var RepoPtrPtr = ref.refType(RepoPtr);

var Remote = ref.types.void;
var RemotePtr = ref.refType(Remote);
var RemotePtrPtr = ref.refType(RemotePtr);

var RemoteHead = ref.types.void;
var RemoteHeadPtr = ref.refType(RemoteHead);
var RemoteHeadPtrPtr = ref.refType(RemoteHeadPtr);
var RemoteHeadPtrPtrPtr = ref.refType(RemoteHeadPtrPtr);

var SizeT = ref.types.size_t;
var SizeTPtr = ref.refType(SizeT);

var libgit2 = FFI.Library('/Users/boopathi.rajaa/workspace/libgit2/build/libgit2.dylib', {
  'git_repository_open': [ 'int', [RepoPtrPtr, 'string']],
  'git_remote_ls': ['int', [RemoteHeadPtrPtrPtr, SizeTPtr, RemotePtr]],
  'git_remote_lookup': ['int', [RemotePtrPtr, RepoPtr, 'string']],
});

var err;

var repoPtrPtr = ref.alloc(RepoPtrPtr);
err = libgit2.git_repository_open(repoPtrPtr, path.resolve('./'));
if (err) return console.log('failed repo open');
if (DEBUG) console.log('open success');

var repoPtr = repoPtrPtr.deref();
var repo = repoPtr.deref();

var remotePtrPtr = ref.alloc(RemotePtrPtr);
err = libgit2.git_remote_lookup(remote, repoPtr, 'origin')
if (err) return console.log('failed to lookup remote');
if (DEBUG) console.log('remote lookup success');

console.log('success');
