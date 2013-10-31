Three Crowns
================================

**Caution:** Boardgames are best played in person on a real table.

Three Crowns is a planned to be a [Carcassonne](http://boardgamegeek.com/boardgame/822/) clone. Its server will be written in JavaScript only and will speak to clients using Websockets, and use [MongoDB](http://www.mongodb.org/) for persistence. A demo client for browsers will also be built, but anything Websocket enabled should be able to be a game client.

This project was created for what I suspect is the most common on GitHub - to fiddle around with tools and languages. Worst case scenario if the project doesn't complete is that everyone has learned something.


Set up the development environment
================================

Game server development requires MongoDB and Node.js.

Clone this repository, and change directory to game-server.

Install the game server's dependencies - 
```
npm install
```

Start the MongoDB server.

Run the tests - 
```
mocha test/ --recursive
```

Run the tests and generate code coverage data -
```
npm run-script coverage
```

Game server API - Draft
================================

This is a draft for the API that clients can use to communicate with the game server. Please note that it's also limited to a minimal working version, so functionality is purposely stripped down. To begin with, this draft will only contain the name of the events. The body of the event message still needs to be documented.


**Event types sent from client to server**

- Game setup
  * join
  * leave
  * start

- Turn
  * isItMyTurn
  * nextTurn
  * activePlayer
  * activeTile

- Game state
  * tilesLeft
  * timeSinceStart
  * isGameStarted
  * isGameEnded

- Player actions
  * placeTile
  * placeMeeple
  * isPossibleCoordinate
  * allPossibleCoordinates

**Events types sent from server to client**

- Game timing events
  * gameStarted
  * gameEnded

- Turn timing events
  * turnStarted
  * turnEnded

- Player actions
  * tilePlacement
  * meeplePlacement
  * constructionCompleted