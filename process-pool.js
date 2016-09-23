'use strict';

const ExternalProcessRunner = require('./external-process-runner.js');

// Configure our process runner with number of concurrent allowed
let runner = new ExternalProcessRunner({
  maxConcurrent: 2
});

// Shorthand function so we can execute and watch some processes
let execute = (delay, duration, output) => {
  setTimeout(() => {
    runner.execute(`sleep ${duration}; echo ${output}`)
      .then(output => { console.log(`=> ${output.stdout}`); })
      .catch(err => console.error(err.stack || err));
  });
};

// Queue up some delayed, timed processes
execute(0, 3, 'PROCESS_A');
execute(0, 2, 'PROCESS_B');
execute(0, 5, 'PROCESS_C');
execute(0, 1, 'PROCESS_D');
execute(1, 4, 'PROCESS_E');
execute(1, 2, 'PROCESS_F');
execute(3, 1, 'PROCESS_G');
