'use strict';

const Promise = require('lazy-promise');
const exec = require('child_process').exec;

let executeFromQueue = (queue) => {
  if (queue._maxConcurrent && queue._maxConcurrent <= queue._runningProcesses) {
    console.log('Deferring processing due to full pool')
    return;
  }
  console.log('Checking Process Queue');
  if (queue._processQueue.length === 0) {
    console.log('Queue is empty');
    return;
  }
  let execution = queue._processQueue.shift();
  queue._runningProcesses++;
  console.log(`Starting execution: ${queue._runningProcesses} current processes, ${queue._processQueue.length} queued`);
  execution
    .then((stderr, stdout) => {
      queue._runningProcesses--;
      console.log(`Completed execution: ${queue._runningProcesses} current processes, ${queue._processQueue.length} queued`);
      executeFromQueue(queue);
    });
};

class ExternalProcessRunner {

  constructor(params) {
    this._command = params.command || undefined;
    this._options = params.options || {};
    this._maxConcurrent = params.maxConcurrent || null;
    this._runningProcesses = 0;
    this._processQueue = [];
  }

  execute(command, options) {
    return new Promise((resolve, reject) => {
      let cmd = command || this._command;
      let opt = options || this._options;
      let execution = new Promise((_resolve, _reject) => {
        console.log(`Actually doing the execution: '${cmd}'`);
        exec(command, options, (err, stdout, stderr) => {
          if (err) {
            reject(err);
            _reject(err);
          } else {
            resolve({ stdout, stderr });
            _resolve({ stdout, stderr });
          }
        });
      });
      console.log(`Queueing up '${command}'`);
      this._processQueue.push(execution);
      executeFromQueue(this);
    });
  }

};

module.exports = ExternalProcessRunner;
