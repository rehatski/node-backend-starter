const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const models = require('../models')
const logger = require('../tools/logger')
const passport = require('passport')

router.post('/signup', function (req, res) {
    const email = req.body.email
    const password = req.body.password

    const userBuild = models.User.build({
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
            console.log("user already exists")
        } else {
            console.log("no user and should save")
            userBuild.save()

            res.setHeader('Content-Type', 'application/json')
            res.status(200)
            res.send(JSON.stringify({
                token: jwt.sign({userId: userBuild.id}, process.env.JWT_SECRET)
            }))
        }
    })
})

router.post('/login', function (req, res) {
    const email = req.body.email
    const password = req.body.password
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
            user.verifyPassword(password)
                .then((verified) => {
                    if ( verified ) {
                        res.setHeader('Content-Type', 'application/json')
                        res.status(200)
                        res.send(JSON.stringify({
                            token: jwt.sign({userId: user.id}, process.env.JWT_SECRET)
                        }))
                    }
                })
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.status(404)
            res.send()

        }
    })
})

router.get('/user-stuff', passport.authenticate('jwt', {session:false}), function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send(JSON.stringify({user: "neat"}))

})


module.exports = router
