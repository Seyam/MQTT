/* -----------------------------                                                
  AUTHOR:  @SEYAM
  seyam.bd.net@gmail.com
------------------------------ */


var mraa = require('mraa');
console.log('MRAA Version: ' + mraa.getVersion());

var led = new mraa.Gpio(13);

led.dir(mraa.DIR_OUT);


const mqtt = require('mqtt')  
const broker = mqtt.connect('mqtt://broker.hivemq.com')





/**
 * The state of the garage, defaults to closed
 * Possible states : closed, opening, open, closing
 */
var state = 'closed'

broker.on('connect', () => {  
  broker.subscribe('garage/open')
  broker.subscribe('garage/close')

  // Inform controllers that garage is connected
  broker.publish('garage/connected', 'true')
  sendStateUpdate()
})

broker.on('message', (topic, message) => {  
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
  broker.publish('garage/state', state)
}

function handleOpenRequest (message) {  
  if (state !== 'open' && state !== 'opening') {

    led.write(1);

    console.log('opening garage door')
    state = 'opening'
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
function handleAppExit (options, err) {  
  if (err) {
    console.log(err.stack)
  }

  if (options.cleanup) {
    broker.publish('garage/connected', 'false')
  }

  if (options.exit) {
    process.exit()
  }
}

/**
 * Handle the different ways an application can shutdown
 */
process.on('exit', handleAppExit.bind(null, {  
  cleanup: true
}))
process.on('SIGINT', handleAppExit.bind(null, {  
  exit: true
}))
process.on('uncaughtException', handleAppExit.bind(null, {  
  exit: true
}))