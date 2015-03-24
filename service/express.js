var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    bodyParser = require('body-parser'),
    log4js = require('log4js'),
    io = require('socket.io')(server),
    logs = {},
    log,
    posts = []

io.on('connection', function(socket){
  log.info("A new user established a socket connection")
  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
  socket.emit('history', posts)
});

app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(bodyParser.json())

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.all('/log', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
 });

// accept POST request on logging route
app.post('/log', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  var payload = req.body

  //write out user if they changed
  if(this.userID !== payload.userID) {
    this.userID = payload.userID
    log.info("user " + payload.userID)
  }

  //log messages
  payload.Log4js.forEach(function (entry) {
    var event = entry.LoggingEvent
    var category = event.logger
    if(!logs.hasOwnProperty(category)) { //get a new logger if needed
      logs[category] = log4js.getLogger(category);
    }
    logs[category][event.level.toLowerCase()](event.message, event.exception)
  })


  //emit messages
  io.emit("loggingEvent", payload)

  //save to history
  posts.unshift(payload)
  if(posts.length > 100 ) {
    posts.shift()
  }
  res.send('success');
})

server.listen(3000, function () {
  log = log4js.getLogger("log4js-service")
  log.info("Starting logging service")
});
