var restify = require('restify'),
    log4js = require('log4js');

var logs = {},
    log,
    server = restify.createServer();

function respond(req, res, next) {
  res.send('hello ' + JSON.stringify(req.params));
  next();
}

server.use(restify.bodyParser());

server.get('/log/:name', respond);
server.head('/hello/:name', respond);
server.post('/log/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var payload = req.params
  var root = Object.keys(payload)[0]
  if(this.userID !== payload.userID) {
    this.userID = payload.userID
    log.info("user " + payload.userID)
  }
  req.params.Log4js.forEach(function (entry) {
    var event = entry.LoggingEvent
    var category = event.logger
    if(!logs.hasOwnProperty(category)) { //get a new logger if needed
      logs[category] = log4js.getLogger(category);
    }
    logs[category][event.level.toLowerCase()](event.message, event.exception)
  })
  //console.log(JSON.stringify(req.params));
  res.send(200);
  res.end();
  return next();
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
  log = log4js.getLogger("log4js-service")
  log.info("Starting logging service")
});
