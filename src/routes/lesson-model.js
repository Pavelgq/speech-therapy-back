// const db = require('../db/database');
const mongoose = require('mongoose');
const logger = require(`../logger/logger`);

// console.log(mongoose);

const lessonSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users'
    },
    date: { 
        type: Date,
        default: Date.now
    },
    duration: Number,
    tasks: [
        {
            game: {
                type: String,
                require: true
            },
            type: {
                type: Number,
                require: true
            },
            reaction: Number,
            total: Number,
            correct: Number,
            fail: Number
        }
    ]

}, {
    timestamps: true
});



const lessonModel = mongoose.model('Lesson', lessonSchema);

module.exports = lessonModel;
