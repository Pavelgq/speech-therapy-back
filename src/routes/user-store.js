// const db = require('../db/database');
const mongoose = require('mongoose');
const crypto = require('crypto')
var ObjectId = require('mongodb').ObjectID;
const logger = require(`../logger/logger`);

const userSchema = new mongoose.Schema({
    displayName: String,
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

// class UserStore {
//     constructor(collection) {
//         this.collection = collection;
//     }

//     async getUser(userId) {
//         return (await this.collection).findOne({
//             "_id": ObjectId(userId)
//         });
//     }

//     async getUserByLogin(login) {
//         return (await this.collection).findOne({
//             "login": login
//         });
//     }
//     //TODO: получить всех пользователей с данными ключами в массиве

//     async getArrayUsers(connectUsers) {
//         const searchPack = connectUsers.map(function (userId) {
//             return ObjectId(userId)
//         });
//         return (await this.collection).find({
//             "_id": {
//                 $in: searchPack
//             }
//         }).toArray();
//     }

//     async save(userData) {
//         return (await this.collection).insertOne(userData);
//     }
// }

// module.exports = new UserStore(setupCollection().catch((e) => logger.error(`Failed to set up "users"-collection`, e)));