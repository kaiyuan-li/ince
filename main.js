const { random } = require('lodash');
let Sandbox = require('./lib/Sandbox')

const poolSize = 1
let mySandbox = new Sandbox({poolSize})

mySandbox.initialize(err => {
  if (err) throw new Error(`unable to initialize the sandbox: ${err}`)

  const code = 'print "Hello, world!"'
  const timeoutMs = 2 * 1000

  console.log('server is up!')
  mySandbox.run({code, timeoutMs}, (err, result) => {
    if (err) throw new Error(`unable to run the code in the sandbox: ${err}`)

    console.log(result.stdout); // Hello, world!
  })
});
