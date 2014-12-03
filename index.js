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
	socket.emit('receiveMessage', ">> Welcome, there are " + userCount + " users in the chat.")
	socket.broadcast.emit('receiveMessage', '== New user ' + socket.id + ' connected.');

	// clients disconnects
  	socket.on('disconnect', function(){
  		userCount--;
  		clients.splice(clients.indexOf(socket), 1);
		io.emit('receiveMessage', '== User ' + socket.id + ' disconnected.');
  	});

  	// process commands and messages
  	socket.on('sendMessage', function(msg){
  		if (msg.substr(0, 5) == "/nick") {
  			// TODO probably better to retain the socket.id and maintain a separate database for nicks
  			var old_nick = socket.id;
  			socket.id = msg.substr(6);
  			socket.emit('receiveMessage', ">> Hey " + socket.id + ", we've changed your nickname.");
  			socket.broadcast.emit('receiveMessage', "== " + old_nick + " has changed nickname to " + socket.id);
  		} else if (msg.substr(0, 6) == "/users") {
  			socket.emit('receiveMessage', ">> List of users connected to this channel");
	        clients.forEach(function(client, index) {
	        	socket.emit('receiveMessage', ">> " + (index+1) + ") " + client.id);
	        });
  		} else {
  			// emit message to all connected browsers
    		socket.broadcast.emit('receiveMessage', socket.id + ': ' + msg);
    	}
  	});
});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});