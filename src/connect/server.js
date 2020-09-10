const express = require(`express`);
const bodyParser = require('body-parser');

const passport = require('passport');
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

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
},
function (email, password, done) {
  userModel.findOne({email}, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user || !user.checkPassword(password)) {
      return done(null, false, {message: 'User does not exist or wrong password.'});
    }
    return done(null, user);
  });
}
)
);

const jwtOptions = {
jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme ("jwt"),
secretOrKey: jwtsecret
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
  userModel.findById(payload.id, (err, user) => {
    if (err) {
      return done(err)
    }
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})
);


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