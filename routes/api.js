const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const models = require('../models')
const logger = require('../logger')

// Body Validations

router.post('/signup', function (req, res) {
    const email = req.body.email
    const password = req.body.password
    console.log(req.body)

    const user = models.User.build({
        email: email,
        password: password
    })

    models.User.findOne({
        where: {
            email: {
                [models.Sequelize.Op.eq]: email
            }
        }
    }).catch(function (e) {
        // TODO: check to see when this would hit
    }).then(user => {
        if (user) {

        } else {

        }
    })
})

router.post('/login', function (req, res) {
    const email = req.body.email
    const password = req.body.passport
    models.User.findOne({
        where: {
            email: {
                [models.Sequelize.Op.eq]: email
            }
        }
    }).catch(function (e) {
        // TODO: check to see when this would hit
    }).then(user => {
        if (user) {

        } else {

        }
    })
})

// Create flare
router.post('/flare', function (req, res) {
    const reqBody = req.body
    models.Flare.create({
        originalLat: reqBody['lat'],
        originalLng: reqBody['lng'],
        currentLat: reqBody['lat'],
        currentLng: reqBody['lng'],
        title: reqBody['title']
    }).then(flare => {
        res.setHeader('Content-Type', 'application/json')
        res.status(200)
        res.send(JSON.stringify({
            'flareId': flare.id,
            token: jwt.sign({from: "HOST", flareId: flare.id}, process.env.JWT_SECRET + flare.id)
        }))
    })
})


// Get flare
router.get('/flare/:id', function (req, res) {
    const flareId = req.params['id']
    models.Flare.findOne({
        where: {
            id: {
                [models.Sequelize.Op.eq]: flareId
            }
        },
        include: [{
            model: models.Viewer
        }]
    }).catch(function (e) {
        // TODO: check to see when this would hit
    }).then(flare => {
        res.setHeader('Content-Type', 'application/json')
        if (flare) {
            res.status(200)
            res.send(JSON.stringify(flare))
        } else {
            res.status(404)
            res.send(JSON.stringify({ 'success': false }))
        }
    })
})

module.exports = router
