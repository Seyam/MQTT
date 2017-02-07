/* -----------------------------                                                
  AUTHOR:  @SEYAM
  seyam.bd.net@gmail.com
------------------------------ */

const mqtt = require('mqtt')  
const client = mqtt.connect('mqtt://broker.hivemq.com')



var m = require('mraa');



console.log('MRAA Version: ' + m.getVersion());


led = m.Gpio(13);
led.dir(mraa.DIR_OUT);


//var led = new m.Aio(13);


var state = 'closed'

client.on('connect', () => {  
  client.subscribe('garage/open')
  client.subscribe('garage/close')

  // Inform controllers that garage is connected
  client.publish('garage/connected', 'true')
  sendStateUpdate()
})

client.on('message', (topic, message) => {  
  console.log('received message %s %s', topic, message)
  switch (topic) {
    case 'garage/open':
      return handleOpenRequest(message)
    case 'garage/close':
      return handleCloseRequest(message)
  }
})

function sendStateUpdate () {  
  console.log('sending state %s', state)
  client.publish('garage/state', state)
}

function handleOpenRequest (message) {  
  if (state !== 'open' && state !== 'opening') {

    led.write(1);
           
    console.log('Turning LED ON')
    state = 'ON'
    sendStateUpdate()

    // simulate door open after 5 seconds (would be listening to hardware)
    setTimeout(() => {
      state = 'open'
      sendStateUpdate()
    }, 5000)
  }
}

function handleCloseRequest (message) {  
  if (state !== 'closed' && state !== 'closing') {

    led.write(0);

    state = 'closing'
    sendStateUpdate()

    // simulate door closed after 5 seconds (would be listening to hardware)
    setTimeout(() => {
      state = 'closed'
      sendStateUpdate()
    }, 5000)
  }
}

/**
 * Want to notify controller that garage is disconnected before shutting down
 */
