# Three Crowns

**Caution:** Boardgames are best played in person on a real table.

Three Crowns is planned to be a [Carcassonne](http://boardgamegeek.com/boardgame/822/) clone. Its server will be written in JavaScript only and will speak to clients using Websockets, and use MongoDB for persistence. A demo client for browsers will also be built, but anything Websocket enabled should be able to be a game client.

This project was created for what I suspect is the most common on GitHub - to fiddle around with tools and languages. Worst case scenario if the project doesn't complete is that everyone has learned something.

## Status
[![Build Status](https://travis-ci.org/thelinmichael/three-crowns.png?branch=master)](https://travis-ci.org/thelinmichael/three-crowns)

## Set up the development environment

The demo frontend is found in /browser-frontend and the backend in /game-server. A JavaScript SDK that basically wraps the WebSocket calls is found in /sdk/js/.

**General requirements:** Node and MongoDB.

**General Grunt tasks:**

`grunt lint` Run JavaScript linting

`grunt test` Run tests

`grunt dev`  Run linting and tests on file changes. game-server restarts if necessary, and browser-frontend runs browserify to compile sources.

### Game server (/game-server)

Install the game server's dependencies
```
npm install
npm install -g grunt-cli
```

Start MongoDB
```
mongod
```

#### Extra Grunt tasks

`grunt coverage` Get code coverage

`grunt start` Start server


### JavaScript SDK (/sdk/js)

`mongod` Start MongoDB

Install the module and link to the game-server package
```
npm install
npm link ../../game-server
```

### Front end (/browser-frontend)

#### Extra Grunt tasks

`grunt start` Start the webserver

In order to do any work on the frontend that requires communication with the game server, you need to start the game server up as well, which in turn needs MongoDB.
```
mongod
cd ../game-server
grunt start
```