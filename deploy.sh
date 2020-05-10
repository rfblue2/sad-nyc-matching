#!/bin/bash

docker login --username=rfblue2@gmail.com --password=$HEROKU_TOKEN registry.heroku.com
docker build -t registry.heroku.com/sad-nyc-matching-staging/server .
docker push registry.heroku.com/sad-nyc-matching-staging/server
IMAGE_ID=$(docker inspect registry.heroku.com/sad-nyc-matching-staging/server --format={{.Id}})
PAYLOAD='{"updates":[{"type":"web","docker_image":"'"$IMAGE_ID"'"}]}'
curl -n -X PATCH https://api.heroku.com/apps/sad-nyc-matching-staging/formation \
-d "$PAYLOAD" \
-H "Content-Type: application/json" \
-H "Accept: application/vnd.heroku+json; version=3.docker-releases" \
-H "Authorization: Bearer $HEROKU_TOKEN"
