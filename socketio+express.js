/* -----------------------------                                                
  AUTHOR:  @SEYAM
  seyam.bd.net@gmail.com
------------------------------ */

var sys = require('sys');
var net = require('net');
var mqtt = require('mqtt'); 

var express = require('express');
var app =express();
var server = require('http').createServer(app);
var io  = require('socket.io')(server);

//var broker = new mqtt.MQTTbroker(1883, '127.0.0.1', 'pusher');
const broker = mqtt.connect('mqtt://broker.hivemq.com');



app.get('/', function(req,res) {
	res.sendFile(__dirname + "/" + "ui.html");
});



 
io.on('connection', function (client) {
	console.log('client connected himself');

	client.on('publish', function (data) {
	    console.log('publishing to '+data.topic);
	    broker.publish(data.topic);
	});


	client.on('disconnect',function(){ //No Parameter For Disconnect Event
		console.log('client disconnected himself');
	});

});


server.listen(5000);
console.log("SocketIO with Express server is running at port 5000!");

 
/*broker.addListener('mqttData', function(topic, payload){
  sys.puts(topic+'='+payload);
  io.sockets.emit('mqtt',{'topic':String(topic),
    'payload':String(payload)});
});*/