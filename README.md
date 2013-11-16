# Three Crowns

**Caution:** Boardgames are best played in person on a real table.

Three Crowns is planned to be a [Carcassonne](http://boardgamegeek.com/boardgame/822/) clone. Its server will be written in JavaScript only and will speak to clients using Websockets, and use MongoDB for persistence. A demo client for browsers will also be built, but anything Websocket enabled should be able to be a game client.

This project was created for what I suspect is the most common on GitHub - to fiddle around with tools and languages. Worst case scenario if the project doesn't complete is that everyone has learned something.

## Status
[![Build Status](https://travis-ci.org/thelinmichael/three-crowns.png?branch=master)](https://travis-ci.org/thelinmichael/three-crowns)

## Set up the development environment

The frontend is found in /browser-frontend and the backend in /game-server.

General requirements: Node and MongoDB.

### Game server

Clone this repository, and change directory to game-server.
```
git clone https://github.com/thelinmichael/three-crowns.git
cd three-crowns/game-server/
```
Install the game server's dependencies
```
npm install
```

Start MongoDB.
```
mongod
```

Run the tests (or run them and get code coverage)
```
grunt test
grunt coverage
```

Start the webserver
```
grunt start
```

### Front end

Clone this repository, and change directory to browser-frontend.
```
git clone https://github.com/thelinmichael/three-crowns.git
cd three-crowns/browser-frontend/
```
Install the frontend's dependencies
```
npm install
npm install -g browserify
```
Start the webserver
```
grunt start
```
Watch for changes in script files and recompile using Browserify when they change
```
grunt dev
```

In order to do any work on the frontend that requires communication with the game server, you need to start the game server up as well, which in turn needs MongoDB.
```
mongod
cd ../game-server
grunt start
```