# Example App

[![Build Status](https://travis-ci.com/rfblue2/example-app.svg?branch=master)](https://travis-ci.com/rfblue2/example-app)

This is a MongoDB backed node express react app intended to be deployed via 
Heroku.  

You must have node (v12) and docker installed.

## Development
Folder is configured with server yarn packages in `package.json`.  Do not
use NPM commands, and delete `package-lock.json` if it exists.

Server folder contains server source and client folder contains client source.
Note that client folder contains its own `package.json` file and also uses yarn,
though generally you should use the provided scripts to interact with the 
client.

### Setup
```
git clone <repository URL>
cd example-app
yarn install
```

### Useful scripts
```
## Dev docker workflow 
## - Starts up local mongo instance on port 27017
## - Starts up server on https://localhost:5000
## - Starts up dev client server on http://localhost:3000
yarn dev

## Low level (to develop locally outside docker):
yarn install # install dependencies

yarn server # start the server (https://localhost:5000)
yarn client # start local client server (http://localhost:3000)

yarn lint # lint and fix code with eslint
yarn test # run jest tests

yarn start # build client assets and serve production-like server
```

Development deploys will watch for changes so there is no need to restart
the servers, unless Dockerfiles or package.json files are changed.

!!Important:
Local development with HTTPS is provided using the devcert library.
As such, running the application locally for the first time will prompt you for 
your system password so that it can install a local certificate to your keychain.
Note that some browsers will not accept the local certificate anyway, and will
explicitly ask if you want to proceed to the site.  Since this is a development
server it is safe to do so, but never do this if you see the warning on a real 
website.

If developing with docker, devcert will not have access to your system keychain
and as a result you will still need to click through the security warnings on
your browser if you try to access the server (https://localhost:5000).  For
API testing, Postman is recommended.

If your are testing without docker, you are responsible for spinning up your
own MongoDB instance and supplying the MONGODB_URI environment variable.
e.g.
```
export MONGODB_URI=mongodb://localhost:27017/example-app
```
