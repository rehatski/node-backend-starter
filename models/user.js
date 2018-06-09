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
        //return new Promise((resolve, reject) => {
        //bcrypt.hash(user.password, saltRounds, function(err, hash) {
        //console.log(hash)
        //user.password = hash
        //return resolve(user, options)
        //})
        //})
        return User.hashPassword(user.password)
            .then(hashedPassword => {
                console.log(hashedPassword)
                user.password = hashedPassword

            })
    })

    User.hashPassword = (password) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function(err, hash) {
                return resolve(hash)
            })
        })
    }

    User.prototype.verifyPassword = function(enteredPassword) {
        return new Promise((resolve, reject) => {
            console.log(`verifyPassword input password: ${enteredPassword} hash: ${this.email}`)
            bcrypt.compare(enteredPassword, this.password, function(err, res) {
                console.log(`verifyPassword result: ${res} error: ${err}`)
                return resolve(res)
            })
        })
    }

    return User;
};
