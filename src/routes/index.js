const express = require('express'),
	 router = express.Router()

router.use('/api', require('./api.js'))

router.get('/', function (req, res) {
  res.render('index.ejs')
})

module.exports = router
