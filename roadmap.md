# Code evaluation engine

## Features

* Working as a service that with HTTP interface (NTH: gRPC).
* Can be deployed to cloud.
* Able to evaluate Python code in a single file (main.py).
* Nice to be able to evaluate pytest and return test result in JSON format.

## MVP CUJ

* User can send Python code as HTTP payload to a cloud service and get the result (stderr) in response.

## TODOs

* Better logging with timestamp and line number.
