/* -----------------------------                                                
  AUTHOR:  @SEYAM
  seyam.bd.net@gmail.com
------------------------------ */

//var sys = require('sys');
//var net = require('net');
var sys = require('util');
var mqtt = require('mqtt'); 
var io  = require('socket.io')();




//var broker = new mqtt.MQTTbroker(1883, '127.0.0.1', 'pusher');
const broker = mqtt.connect('mqtt://broker.hivemq.com')
 
io.on('connection', function (client) {


	console.log('client connected himself');


	client.on('publish', function (data) {
	    console.log('publishing to '+data.topic);
	    broker.publish(data.topic);
	});



	client.on('subscribe', function (data) {
        console.log('Subscribing to '+data.topic);
        //socket.join(data.topic);
        broker.subscribe(data.topic);
    });





	client.on('disconnect',function(){ //No Parameter For Disconnect Event
		console.log('client disconnected himself');
	});

});




client.addListener('mqttData', function(topic, payload){
  sys.puts(topic+'='+payload);
  io.sockets.emit('mqtt',{'topic':String(topic),
    					  'payload':String(payload)});
});





// // listen to messages coming from the mqtt broker
// broker.on('message', function (topic, payload, packet) {
//     console.log(topic+'='+payload);
//     io.sockets.emit('mqtt',{'topic':String(topic),
//                             'payload':String(payload)});
// });




io.listen(5000);
console.log("SocketIO server is running at port 5000!");

 
/*broker.addListener('mqttData', function(topic, payload){
  sys.puts(topic+'='+payload);
  io.sockets.emit('mqtt',{'topic':String(topic),
    'payload':String(payload)});
});*/