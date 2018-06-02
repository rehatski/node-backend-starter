const express = require('express'),
	 router = express.Router()

router.use('/api', require('./api.js'))

router.get('/', function (req, res) {
    // TODO: update this with intro page with about, ads, client apps, and input field for flare id
  res.render('trackpage.ejs', { updated: '10-1-2017', location: 'lat lng here' })
})

router.get('/:id', function (req, res) {
    // TODO: grab tracker page model and load page with data
  var trackerID = req.params['id']
  res.render('trackpage.ejs', { updated: '10-1-2017', location: 'lat lng here' })
})

module.exports = router
