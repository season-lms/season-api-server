#!/bin/bash
DOCKER_APP_NAME=nest-app

EXIST_BLUE=$(docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose.blue.yml ps | grep Up)

if [ -z "$EXIST_BLUE" ]; then
    echo "blue up"
    docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose.blue.yml up -d

    sleep 10

    docker-compose -p ${DOCKER_APP_NAME}-green -f docker-compose.green.yml down -d
else
    echo "green up"
    docker-compose -p ${DOCKER_APP_NAME}-green -f docker-compose.green.yml up -d

    sleep 10

    docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose.blue.yml down -d
fi
