'use strict';
const bcrypt = require('bcrypt')
const saltRounds = 10

// TODO: make sure this does not get over written when modifing though migrations
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        email: DataTypes.STRING,
        password: DataTypes.STRING
    }, {});

    User.associate = function(models) {
        // associations can be defined here
    };

    User.beforeCreate((user, options) => { //maybe change to beforeSave
        console.log("wee")
        return new Promise((resolve, reject) => {
            bcrypt.hash(user.password, saltRounds, function(err, hash) {
                console.log(hash)
                user.password = hash
                return resolve(user, options)
            })

        })
    })

    return User;
};
