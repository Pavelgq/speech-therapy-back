// const db = require('../db/database');
const mongoose = require('mongoose');
const crypto = require('crypto');
var ObjectId = require('mongodb').ObjectID;
const logger = require(`../logger/logger`);

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: 'role is required',
        default: 'user'
    },
    firstName: String,
    lastName: String,
    sex: String,
    class: String,
    level: { 
        type: Number,
        default: 1
    },
    money: { 
        type: Number,
        default: 0
    },
    exp: { 
        type: Number,
        default: 0
    },
    login: {
        type: String,
        unique: 'this login already exist'
    },
    email: {
        type: String,
        required: 'e-mail is required',
        unique: 'this e-mail already exist'
    },
    passwordHash: String,
    salt: String,
}, {
    timestamps: true
});

userSchema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        if (password) {
            this.salt = crypto.randomBytes(128).toString('base64');
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
        } else {
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    })
    .get(function () {
        return this._plainPassword;
    });

userSchema.methods.checkPassword = function (password) {
    if (!password) return false;
    if (!this.passwordHash) return false;
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;