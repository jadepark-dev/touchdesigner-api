const socket = io('http://192.168.0.111:3000/')

init()

function init() {
  let el = document.getElementById('controller')
  el.width = window.innerWidth
  el.height = window.innerHeight
  el.addEventListener('touchstart', handleStart, false)
  el.addEventListener('touchend', handleEnd, false)
  el.addEventListener('touchcancel', handleCancel, false)
  el.addEventListener('touchmove', handleMove, false)
  log('initialized')
}

let ongoingTouches = []

function handleStart(evt) {
  evt.preventDefault();
  log("touchstart.");
  let el = document.getElementsByTagName("canvas")[0];
  let ctx = el.getContext("2d");
  let touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    log("touchstart:" + i + "...");
    ongoingTouches.push(copyTouch(touches[i]));
    let color = colorForTouch(touches[i]);
    ctx.beginPath();
    ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
    ctx.fillStyle = color;
    ctx.fill();
    log("touchstart:" + i + ".");
  }
}

function handleMove(evt) {
  evt.preventDefault();
  let el = document.getElementsByTagName("canvas")[0];
  let ctx = el.getContext("2d");
  let touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    let color = colorForTouch(touches[i]);
    let idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      log("continuing touch "+idx);
      ctx.beginPath();
      log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();

      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record

      const msg = {
        x: ongoingTouches[0].pageX,
        y: ongoingTouches[0].pageY
      }
      socket.emit('touchmove', msg)
      log(".");
    } else {
      log("can't figure out which touch to continue");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  log("touchend");
  let el = document.getElementsByTagName("canvas")[0];
  let ctx = el.getContext("2d");
  let touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    let color = colorForTouch(touches[i]);
    let idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    } else {
      log("can't figure out which touch to end");
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  log("touchcancel.");
  let touches = evt.changedTouches;

  for(let i = 0; i < touches.length; i++) {
    let idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1);  // remove it; we're done
  }
}

function colorForTouch(touch) {
  var r = touch.identifier % 16;
  var g = Math.floor(touch.identifier / 3) % 16;
  var b = Math.floor(touch.identifier / 7) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  var color = "#" + r + g + b;
  log("color for touch with identifier " + touch.identifier + " = " + color);
  return color;
}

function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

function log(msg) {
  var p = document.getElementById('log');
  p.innerHTML = msg + "\n" + p.innerHTML;
}
//socket listeners
socket.on('connected', function (msg) {
  log('connected to server')
})

socket.on('touchmove', function (msg) {
  console.log(msg)
})