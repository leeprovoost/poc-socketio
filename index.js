var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  	res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	io.emit('MSG', 'new user connected');

  	socket.on('disconnect', function(){
		io.emit('MSG', 'user disconnected');
  	});

  	socket.on('MSG', function(msg){
  		// parse perosnal commands (/nick = 5 chars)
  		if (msg.substr(0, 5) == "/nick") {
  			io.emit('MSG', 'detected nickname');
  			var nickname = msg.substr(6);
  			io.emit('MSG', 'Nickname set to: ' + nickname);
  		} else {
  			// emit message to all connected browsers
    		io.emit('MSG', msg);
    	}
  	});
});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});