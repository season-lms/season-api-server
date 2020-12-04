#!/bin/bash

cd /home/ubuntu/deploy/nest-app
chmod +x ./deploy.sh
./deploy.sh > /dev/null 2> /dev/null < /dev/null &