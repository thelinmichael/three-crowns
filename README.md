# Three Crowns

**Caution:** Boardgames are best played in person on a real table.

Three Crowns is planned to be a [Carcassonne](http://boardgamegeek.com/boardgame/822/) clone. Its server will be written in JavaScript only and will speak to clients using Websockets, and use MongoDB for persistence. A demo client for browsers will also be built, but anything Websocket enabled should be able to be a game client.

This project was created for what I suspect is the most common on GitHub - to fiddle around with tools and languages. Worst case scenario if the project doesn't complete is that everyone has learned something.

## Status
[![Build Status](https://travis-ci.org/thelinmichael/three-crowns.png?branch=master)](https://travis-ci.org/thelinmichael/three-crowns)

The demo frontend is found in `/browser-frontend` and the backend in `/game-server`. A JavaScript SDK that basically wraps the WebSocket calls is found in `/sdk/js/`.