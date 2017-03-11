var express = require('express');
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server)


//server.listen(3000);

var port = process.env.PORT || 3000;

//app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname + '/public'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  //response.render('pages/index');
        response.send("Start at port:"+port)
        
        
        //var exec = require('child_process').exec;
        //var cmd = 'ffmpeg -re -i /Users/maccomputer/Videos/Mad_Max.mp4 -c copy -f flv rtmp://192.168.2.95/myapp';
        
            //ffmpeg -i rtmp://@192.168.241.1:62156 -acodec copy -vcodec copy c:/abc.mp4
        
       // exec(cmd, function(error, stdout, stderr) {
             // command output is in stdout
            // response.send("Is streaming")
        //});
        
        
        
        
});

//app.listen(port, function() {
  //console.log('Node app is running on port', port);
//});

server.listen(port)

app.get('/rooms', function(req, res) {
        var roomList = Object.keys(rooms).map(function(key) {
                                              return rooms[key]
                                              })
        res.send(roomList)
        })

var rooms = {}

io.on('connection', function(socket) {
      
      socket.on('create_room', function(room) {
                if (!room.key) {
                return
                }
                console.log('create room:', room)
                var roomKey = room.key
                rooms[roomKey] = room
                socket.roomKey = roomKey
                socket.join(roomKey)
                })
      
      socket.on('close_room', function(roomKey) {
                console.log('close room:', roomKey)
                delete rooms[roomKey]
                })
      
      socket.on('disconnect', function() {
                console.log('disconnect:', socket.roomKey)
                if (socket.roomKey) {
                delete rooms[socket.roomKey]
                }
                })
      
      socket.on('join_room', function(roomKey) {
                console.log('join room:', roomKey)
                socket.join(roomKey)
                })
      
      socket.on('upvote', function(roomKey) {
                console.log('upvote:', roomKey)
                io.to(roomKey).emit('upvote')
                })
      
      socket.on('gift', function(data) {
                console.log('gift:', data)
                io.to(data.roomKey).emit('gift', data)
                })
      
      socket.on('comment', function(data) {
                console.log('comment:', data)
                io.to(data.roomKey).emit('comment', data)
                })
      
      })

console.log('listening on port 3000...')


