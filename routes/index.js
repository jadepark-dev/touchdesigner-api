const express = require('express')
const router = express.Router()
//use for router
let socket

/* controller */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/touchmove', function(req, res, next) {
  res.render('controller/touchmove')
})

router.get('/gyro', function(req, res, next) {
  res.render('controller/gyro')
})


module.exports = router
