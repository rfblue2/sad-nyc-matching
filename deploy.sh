#!/bin/bash

docker login --username=rfblue2@gmail.com --password=$HEROKU_TOKEN registry.heroku.com
docker build -t registry.heroku.com/example-app-staging/server .
docker push registry.heroku.com/example-app-staging/server
export IMAGE_ID=$(docker inspect registry.heroku.com/example-app-staging/server --format={{.Id}})
export PAYLOAD='{"updates":[{"type":"web","docker_image":"'"$IMAGE_ID"'"}]}'
curl -n -X PATCH https://api.heroku.com/apps/example-app-staging/formation \
-d "$PAYLOAD" \
-H "Content-Type: application/json" \
-H "Accept: application/vnd.heroku+json; version=3.docker-releases" \
-H "Authorization: Bearer $HEROKU_TOKEN"
