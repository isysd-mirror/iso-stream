"use strict";

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var assert = require('assert/');

var Readable = require('../../lib/_stream_readable');

var len = 0;
var chunks = new Array(10);

for (var i = 1; i <= 10; i++) {
  chunks[i - 1] = bufferShim.allocUnsafe(i);
  len += i;
}

var test = new Readable();
var n = 0;

test._read = function (size) {
  var chunk = chunks[n++];
  setTimeout(function () {
    test.push(chunk === undefined ? null : chunk);
  }, 1);
};

test.on('end', thrower);

function thrower() {
  throw new Error('this should not happen!');
}

var bytesread = 0;
test.on('readable', function () {
  var b = len - bytesread - 1;
  var res = test.read(b);

  if (res) {
    bytesread += res.length;
    console.error("br=".concat(bytesread, " len=").concat(len));
    setTimeout(next, 1);
  }

  test.read(0);
});
test.read(0);

function next() {
  // now let's make 'end' happen
  test.removeListener('end', thrower);
  test.on('end', common.mustCall()); // one to get the last byte

  var r = test.read();
  assert(r);
  assert.strictEqual(r.length, 1);
  r = test.read();
  assert.strictEqual(r, null);
}

;

require('tap').pass('sync run');

var _list = process.listeners('uncaughtException');

process.removeAllListeners('uncaughtException');

_list.pop();

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});