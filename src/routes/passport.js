const passport = require('passport'); //passport for Koa
const LocalStrategy = require('passport-local'); //local Auth Strategy
const JwtStrategy = require('passport-jwt').Strategy; // Auth via JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // Auth via JWT

const jwtsecret = require('../secret/jwtsecret');
const userModel = require(`./user-model`);

const makePassport = () => {
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

}


module.exports = makePassport;
