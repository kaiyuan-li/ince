#!/bin/bash
IMAGE_NAME="kaili/docker_sandbox"

if [ $# = 1 ]; then
	IMAGE_NAME="$1"
fi

echo "Building image '$IMAGE_NAME'..."
docker build -t $IMAGE_NAME .
