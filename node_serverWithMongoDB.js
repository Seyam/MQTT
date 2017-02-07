/* Pusher.js
Server side node.js script that services real-time websocket requests
Allows websocket connections to subscribe and publish to MQTT topics
*/


//var express = require('express');
//var app = express();
//var fs = require("fs");
//var bodyParser = require('body-parser');
var mongoose = require('mongoose');


//var request = require('request');
var moment = require('moment');
var momentTimezone = require('moment-timezone');




var sys = require('util');
var net = require('net');
var mqtt = require('mqtt');


mongoose.connect('mongodb://192.168.10.109/myDB');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log( "we're connected!");
});



var mySchema = mongoose.Schema({
    SensorName: String,
    SensorValue: String,
    Day        : String

});

var SensorType = mongoose.model('SensorType', mySchema);

 
// create a socket object that listens on port 5000
var io = require('socket.io').listen(5000);
 
// create an mqtt client object and connect to the mqtt broker
//var client = mqtt.connect('mqtt://iot.eclipse.org');
 
io.sockets.on('connection', function (socket) {
    // socket connection indicates what mqtt topic to subscribe to in data.topic
    socket.on('subscribe', function (data) {
        console.log('Subscribing to '+data.topic);
        socket.join(data.topic);
        //client.subscribe(data.topic);
        //client.subscribe(data.topic);
    });
    // when socket connection publishes a message, forward that message
    // the the mqtt broker
    socket.on('publish', function (data) {
        console.log('Publishing to '+data.topic+' '+data.payload);
        //client.publish(data.topic,data.payload);

        var sensorData = {"sdata": data.payload, "did":"0001", "dtime":"2016/06/06 16:41:56"};

              db.collection('SensorData').insert(sensorData, function (err, result) {
                    // if (err)
                    //    res.send('Error');
                    // else
                    //   res.send('Success');
              });
    });
});





console.log('Server running at port 5000!')




// listen to messages coming from the mqtt broker
// client.on('message', function (topic, payload, packet) {
//     console.log(topic+'='+payload);
//     io.sockets.emit('mqtt',{'topic':String(topic),
//                             'payload':String(payload)});
// });