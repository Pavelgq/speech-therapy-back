const express = require(`express`);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local'); //локальная стратегия авторизации
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT

const userStore = require(`../routes/user-store`);

// const imageStore = require(`../images/imageStore`);
const userRoutes = require(`../routes/user-routes`)(userStore);//, imageStore);

const logger = require(`../logger/logger`);

const app = express();
app.use(express.static(`static`));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use(`/api/user`, userRoutes);
// app.use(`/api/stats`, statsRouter);

const HOSTNAME = process.env.SERVER_HOST || `localhost`;
const PORT = parseInt(process.env.SERVER_PORT, 10) || 3000;

const serverAddress = `http://${HOSTNAME}:${PORT}`;
module.exports = {
  run() {
    app.listen(PORT, HOSTNAME, () => {
      logger.info(`Server running at ${serverAddress}/`);
    });
  },
  app
};