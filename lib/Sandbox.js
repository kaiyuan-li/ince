"use strict";

let _           = require('lodash')
let async       = require('async')
let Container   = require('./Container')
let PoolManager = require('./PoolManager')
let Job         = require('./Job')
let fs          = require('fs-extra')
let log         = require('winston')
var Docker      = require('dockerode')

const defaultOptions = {
  "poolSize": 1,
  "memoryLimitMb": 50,
  "imageName": "kaili/docker_sandbox",
  "timeoutMs": 5000
};

const noop = () => {}

class Sandbox {

  constructor(options) {
      this.options = _.defaults(options, defaultOptions)

      this.options.containerLaunchOptions = (port) => ({
        "Image": this.options.imageName,
        "NetworkDisabled": false,
        "AttachStdin": false,
        "AttachStdout": false,
        "AttachStderr": false,
        "OpenStdin": false,
        "Privileged": false,
        "User": "sandboxuser",
        "Tty": false,
        "HostConfig": {
            "Memory": this.options.memoryLimitMb * 1000000,
            "MemorySwap": -1,
            "Privileged": false,
            "CpusetCpus": "0", // only use one core
            "PortBindings": { '3000/tcp': [{"HostPort": port.toString()}] }
        },
        "Labels": {
          "__docker_sandbox": "1"
        },
        ExposedPorts: {
          "3000/tcp": {}
        }
      })

      this.docker  = new Docker()
      this.manager = new PoolManager(this.docker, options)

      // cleans up the containers when exiting.
      const cleanupEvents = ['beforeExit', 'SIGINT']
      const cleanupFn = this.cleanup.bind(this, true)
      cleanupEvents.map(event => {
        process.on(event, cleanupFn)
      });

  }

  /*
   * Initializes the sandbox by creating the pool of
   * containers
   */
  initialize(cb) {
    this.manager.initialize(this.options.poolSize, cb)
  }

  /*
   *  (deprecated, use 'initialize')
   *  Initializes the pool and creates required containers
   */
  createPool (cb) {
    this.manager.initialize(this.options.poolSize, cb)
  }

  /*
   * Runs the specifed code
   */
  run (options, cb) {
    let code = _.isObject(options) ? options.code : options;
    let v3 = (options.v3 === true) ? true : false // python3 switch
    let timeoutMs = _.isObject(options) && options.timeoutMs ? options.timeoutMs : this.options.timeoutMs

    if (!code || !_.isString(code))
      throw new Error("Please provide the code to run as a string or an object {code: xxx}")

    const job = new Job(code, timeoutMs, cb, v3)
    log.info('running code:\n' + code)
    this.manager.executeJob(job)
  }


  /*
   *  Cleanups various resources such as temporary
   *  files and docker containers
   */
  cleanup(cb) {
    log.debug("cleaning up")

    if (typeof cb === 'boolean') {
      cb = null
      var exit = true;
    }
    else {
      cb = cb || _.noop
    }

    this.manager.cleanup( err => {
      if (cb) return cb(err)
      else if (exit) process.exit();
    })
  }

}

module.exports = Sandbox
module.exports.defaultOptions = defaultOptions
