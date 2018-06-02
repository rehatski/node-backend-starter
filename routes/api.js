const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const models = require('../models')
const logger = require('../logger')

// Body Validations

router.post('/flare', function (req, res, next) {
    const ret = Joi.validate(req.body, models.Flare.schema.create, {
        allowUnknown: false,
        abortEarly: false
    })

    if (ret.error) {
        res.status(400).end(ret.error.toString())
    } else {
        next()
    }
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
