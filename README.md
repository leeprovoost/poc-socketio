# poc-socketio

Proof-of-Concept application to learn about socket.io and real-time messaging applications. This is part of my ["learn a new thing every month" project](http://leeprovoost.github.io/). 

Started with following the tutorial on http://socket.io/get-started/chat/ and then implemented some of the exercises. It's quite rudimentary and needs lots of improvements, like sending events to the client instead of formatted messages. Might do it when I have more time later. 

## Use

Start server: `node index.js`

Implemented chat commands:
* /nick [username], e.g. /nick lee: Change username
* /users: show list of all online users
* [message], e.g. hello!: Broadcast message

## Useful links

* http://stackoverflow.com/questions/6563885/socket-io-how-do-i-get-a-list-of-connected-sockets-clients
* http://stackoverflow.com/questions/8788790/list-of-connected-clients-username-using-socket-io

