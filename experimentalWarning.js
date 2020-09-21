'use strict'
import global from '../global/global.js'
import { Process } from '../process/process.js'
global.process = Process.getProcess()

var experimentalWarnings = new Set();

export var emitExperimentalWarning = function (feature) {
  if (experimentalWarnings.has(feature)) return;
  var msg = feature + ' is an experimental feature. This feature could ' +
       'change at any time';
  experimentalWarnings.add(feature);
  process.emitWarning(msg, 'ExperimentalWarning');
}

if (!(process.emitWarning instanceof Function)) {
  emitExperimentalWarning = function () {}
}

export default emitExperimentalWarning
