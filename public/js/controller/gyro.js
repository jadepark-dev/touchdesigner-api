const socket = io('http://192.168.0.111:3000')

//TODO need https to access these APIs
function requestMotionPermission(){
  console.log('devicemotion permission requested')
  DeviceOrientationEvent.requestPermission()
  .then(response => {
      if (response == 'granted') {
        window.addEventListener("devicemotion", handleMotion, true);
      }
  })
  .catch(console.error)
}
function requestOrientationPermission(){
  console.log('deviceorientation permission requested')
  DeviceOrientationEvent.requestPermission()
  .then(response => {
      if (response == 'granted') {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
  })
  .catch(console.error)
}
function handleOrientation(event) {
  const data = {
    absolute: event.absolute,
    alpha: event.alpha,
    beta: event.beta,
    gamma: event.gamma
  }
  console.log(event)

  log(data.absolute + '/'+ data.alpha + '/'+  data.beta + '/'+  data.gamma)

  socket.emit('gyro', data)
  

  // Do stuff with the new orientation data
}

function handleMotion(event){
  const data = {
    acc: event.acceleration,
    acc_g: event.accelerationIncludingGravity,
    rot: event.rotationRate,
    interval: event.interval
  }
  
  socket.emit('motion', data)
}
function log(msg) {
  var p = document.getElementById('log');
  p.innerHTML = msg + "\n" + p.innerHTML;
}

//socket listeners
socket.on('connected', function (msg) {
  log('connected to server')
})