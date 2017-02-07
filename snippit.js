function checkState(){

    var reading = button.read();
    console.log('Button state= '+reading);

    if(reading == 1 && prevState==0){
        state=0;              
    }
    else{
        state=1;;
    }

    led.write(state)
    //setTimeout(checkState, 250);
}
