var express = require("express");
var app = express();
var server = app.listen(3000);
app.use(express.static("public"));

var socket = require("socket.io");
var io = socket(server);

var history = [];
io.sockets.on("connection", function (Socket) {
  console.log(history);
  if (history.length > 0) {
    Socket.emit("serverMessage", history);
  }
  console.log("new connection " + Socket.id);

  Socket.on("sendMessage", function (data) {
    //send a discord message.
    if (history.length === 10) {
      history.shift();
      history.push(data);
    } else {
      history.push(data);
    }

    io.sockets.emit("serverMessage", history);
  });
});
