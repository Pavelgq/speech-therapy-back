const {
    MongoClient
} = require(`mongodb`);
const mongoose = require('mongoose');
const logger = require(`../logger/logger`);
const mongoURL = require('../secret/mongo-url');

const startDB = async () => {
    try {
        mongoose.set('useCreateIndex', true);
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        mongoose.Promise = global.Promise;
        mongoose.set('debug', true);
        const db = await mongoose.connection;

        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', function () {
            console.log('connect')
        });
    } catch (error) {
        logger.error(error);
    }
}

module.exports = startDB;