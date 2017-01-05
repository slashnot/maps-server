var jsonServer = require('json-server');
var sockjs = require('sockjs');
var node_static = require('node-static');


// 1. Echo sockjs server
var sockjs_opts = { sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js" };

var sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', function (conn) {
    conn.on('data', function (message) {
        conn.write(message + 'from Server');
    });
    var count = 0;
    if (count <= 40) {
        setInterval(function () {
            count++;
            conn.write("Data-->" + Math.floor(Math.random() * (10 - 1) + 1));
        }, 1000);
    }

});
///////////////////////////

var server = jsonServer.create();

server.set('port', (process.env.PORT || 5000));
server.use(jsonServer.defaults());
var router = jsonServer.router('data.json');
server.use(router);

sockjs_echo.installHandlers(server, { prefix: '/echo' });
server.listen(server.get('port'), function() {
  console.log('Node app is running on port', server.get('port'));
});
