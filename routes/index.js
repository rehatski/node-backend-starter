const express = require('express'),
	 router = express.Router()

router.use('/api', require('./api.js'))

router.get('/', function (req, res) {
    console.log("shit")
  res.render('index.ejs')
})

module.exports = router
