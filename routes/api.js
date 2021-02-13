const express = require('express')
const router = express.Router()
let socket

/* controller */
router.get('/', function(req, res, next) {
  res.render('controller/index', { title: 'Express' })
})

/* socket communication */



module.exports = (io) => {
  socket = io
  io.on('connection', function (_socket) {
    console.log('client connected via socket')

    _socket.on('touchmove', function(msg){
      console.log(msg)
      _socket.emit('touchmove', msg)
    })

    _socket.on('disconnect', function () {
      console.log('client disconnected')
    })
  })
  return router
}
