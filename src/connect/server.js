const express = require(`express`);
const bodyParser = require('body-parser');

const passport = require('passport');
const makePassport = require('../routes/passport')
const LocalStrategy = require('passport-local'); //local Auth Strategy
const JwtStrategy = require('passport-jwt').Strategy; // Auth via JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // Auth via JWT

const jwtsecret = require('../secret/jwtsecret');
const userModel = require(`../routes/user-model`);

const startDB = require(`../db/database`)



// const imageStore = require(`../images/imageStore`);
const userRoutes = require(`../routes/user-routes`);//, imageStore);

const logger = require(`../logger/logger`);

const app = express();
app.use(express.static(`static`));
app.use(bodyParser.json());
app.use(passport.initialize());

makePassport();

app.use(`/api/user`, userRoutes);
// app.use(`/api/stats`, statsRouter);

const HOSTNAME = process.env.SERVER_HOST || `localhost`;
const PORT = parseInt(process.env.SERVER_PORT, 10) || 3000;

const serverAddress = `http://${HOSTNAME}:${PORT}`;
module.exports = {
  run() {
    startDB();
    app.listen(PORT, HOSTNAME, () => {
      logger.info(`Server running at ${serverAddress}/`);
    });
  },
  app
};