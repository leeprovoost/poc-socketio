var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  	res.sendfile('index.html');
});

io.on('connection', function(socket){
	io.emit('MSG', 'new user connected');

  	socket.on('disconnect', function(){
		io.emit('MSG', 'user disconnected');
  	});
  	
  	socket.on('MSG', function(msg){
    	io.emit('MSG', msg);
  	});
});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});