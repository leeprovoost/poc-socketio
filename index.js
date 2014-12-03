var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userCount = 0;
var clients = [];

app.get('/', function(req, res){
  	res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	// new user has joined
	userCount++;
	clients.push(socket); 
	socket.emit('receiveMessage', "PRIVATE: Welcome, there are " + userCount + " users in the chat.");
	// temp initialise username with id
	socket.username = socket.id;
	socket.broadcast.emit('receiveMessage', 'BROADCAST: New user ' + socket.username + ' connected.');

	// clients disconnects
  	socket.on('disconnect', function(){
  		userCount--;
  		clients.splice(clients.indexOf(socket), 1);
		io.emit('receiveMessage', 'BROADCAST: User ' + socket.username + ' disconnected.');
  	});

  	// process commands and messages
  	socket.on('sendMessage', function(msg){
  		if (msg.substr(0, 5) == "/nick") {
  			// TODO probably better to retain the socket.id and maintain a separate database for nicks
  			var old_nick = socket.username;
  			socket.username = msg.substr(6);
  			socket.emit('receiveMessage', "PRIVATE: Hey " + old_nick + ", we've changed your nickname to: " + socket.username);
  			socket.broadcast.emit('receiveMessage', "BROADCAST " + old_nick + " has changed nickname to " + socket.username);
  		} else if (msg.substr(0, 6) == "/users") {
  			socket.emit('receiveMessage', "BROADCAST: List of users connected to this channel");
	        clients.forEach(function(client, index) {
	        	socket.emit('receiveMessage', "BROADCAST: " + (index+1) + ") " + client.username);
	        });
  		} else {
  			// emit message to all connected browsers
    		socket.broadcast.emit('receiveMessage', socket.username + ': ' + msg);
    	}
  	});
});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});