var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');
var child_process = require('child_process');
var _ = require('underscore');
let Sandbox = require('./lib/Sandbox')

const poolSize = 5
let mySandbox = new Sandbox({ poolSize })

mySandbox.initialize(err => {
  if (err) throw new Error(`unable to initialize the sandbox: ${err}`)
});

var app = express();

var port = process.env.PORT || 3000;

app.use(cors())
app.use(bodyParser.json());

app.post('/', function (req, res) {

  res.setHeader('Content-Type', 'application/json');

  if (!req.body.code || !req.body.timeoutMs) {
    res.status(400);
    res.end(JSON.stringify({ error: "no code or timeout specified" }));
    return
  }
  res.status(200)
  mySandbox.run(req.body, (err, result) => {
    if (err) throw new Error(`unable to run the code in the sandbox: ${err}`)

    res.end(JSON.stringify(result))
  })

});

app.get('/hi', (req, res) => {
  res.end('hello!')
})

app.listen(port, function () {
  console.log('Service running on port ' + port);
});