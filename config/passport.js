const passport = require('passport')
const passportJWT = require('passport-jwt')

const models = require('../models')

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
}

const jwtStrategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload)
    const userId = jwt_payload.id
    models.User.findOne({
        where: {
            id: {
                [models.Sequelize.Op.eq]: userId
            }
        }
    }).catch(function (e) {
        // TODO: check to see when this would hit
    }).then(user => {
        if (user) {
            next(null, user)
        } else {
            next(null, false)
        }
    })
})

passport.use(jwtStrategy)
