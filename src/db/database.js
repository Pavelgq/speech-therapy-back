const {MongoClient} = require(`mongodb`);
const mongoose = require('mongoose');
const logger = require(`../logger/logger`);



mongoose.connect('mongodb+srv://pavel:5430027@cluster0.3rwmy.mongodb.net/speech?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true });

// const db = mongoose.connection;
// db.on('error',  logger.error(`Failed to connect to MongoDB`));
// db.once('open', function() {
//   // we're connected!
// });
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
var db = mongoose.connection;
db.on('error', logger.error.bind(console, 'MongoDB connection error:'));