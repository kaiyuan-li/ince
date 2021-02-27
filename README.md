# Code Evaluation Engine (ceval)

## What is it?
ceval is a code evaluation engine that runs untrusted code on containers. The engine maintains a pool of containers and uses then to run code when HTTP request is received.

## Development

Build the docker image

```bash
cd container && ./bash.sh
```

Run examples

```
node examples/main.js
```