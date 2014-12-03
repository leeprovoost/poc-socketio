var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  	res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	// assign automatic id to new client
	io.emit('MSG', '>> New user ' + socket.id + ' connected.');

	// clients disconnects
  	socket.on('disconnect', function(){
		io.emit('MSG', '>> User ' + socket.id + ' disconnected.');
  	});

  	// process commands and messages
  	socket.on('MSG', function(msg){
  		if (msg.substr(0, 5) == "/nick") {
  			// TODO probably better to retain the socket.id and maintain a separate database for nicks
  			var old_nick = socket.id;
  			socket.id = msg.substr(6);
  			socket.emit('MSG', ">> Hey " + socket.id + ", we've changed your nickname.");
  			io.emit('MSG', old_nick + " has changed nickname to " + socket.id);
  		} else if (msg.substr(0, 6) == "/users") {

  		} else {
  			// emit message to all connected browsers
    		io.emit('MSG', socket.id + ': ' + msg);
    	}
  	});
});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});