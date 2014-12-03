var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  	res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	// assign automatic id to new client
	io.sockets['nickname'] = socket.id;
	io.emit('MSG', '>> New user ' + io.sockets['nickname']) + ' connected.';

	// clients disconnects
  	socket.on('disconnect', function(){
		io.emit('MSG', '>> User ' + io.sockets['nickname'] + ' disconnected.');
		// TODO: remove from database
  	});

  	// process commands and messages
  	socket.on('MSG', function(msg){
  		if (msg.substr(0, 5) == "/nick") {
  			io.sockets['nickname'] = msg.substr(6);
  			io.emit('MSG', 'Nickname set to: ' + io.sockets['nickname']);
  		} else if (msg.substr(0, 6) == "/users") {

  		} else {
  			// emit message to all connected browsers
    		io.emit('MSG', msg);
    	}
  	});
});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});