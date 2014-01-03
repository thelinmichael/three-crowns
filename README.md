# Three Crowns

**Caution:** Boardgames are best played in person on a real table.

Three Crowns is planned to be a [Carcassonne](http://boardgamegeek.com/boardgame/822/) clone. 

The server, found in the `/game-server` directory, will be written in JavaScript, using MongoDB for persistance and Mongoose for object data modelling. It will speak with clients using Websockets. A demo client for browsers will also be built in the `/browser-frontend` directory, but anything Websocket enabled should be able to be a game client. Finally, any tools that easies development of game clients will be placed in the `/sdk` directory.

### Why?
This project was created for what I suspect is the most common on GitHub - to fiddle around with tools and languages. Worst case scenario if the project doesn't complete is that the people involved has learned something.

## First release
The first release will contain a game server that can handle a the base game and an optional Inns & Cathedrals expansion.

### Left to do ###

#### Game logic
 - Keeping track of player score and deciding the winner
 - Not allowing meeple placement on areas where meeples already exist
 - Figure out how to handle three-way-crossings that doesn't seem to have a stop
 - Get scores for all area types
 - Figure out how to calculate score for grass
 - Figure out how to calculate score for monastery
 - River can't make 180 degree turns

#### Gamepacks
 - Modelling tiles from the Inns & Cathedral expansion
 - Adding remaining tiles from the basegame
 - Adding remaining river tiles

#### Websocket API
 - Design document
 - Implementation
 - Documentation


## Status
[![Build Status](https://travis-ci.org/thelinmichael/three-crowns.png?branch=master)](https://travis-ci.org/thelinmichael/three-crowns)