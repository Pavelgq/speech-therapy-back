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
      userModel.findOne({
        email
      }, (err, user) => {
        console.log("this", err, user)
        if (err) {
          return done(err, false, {
            message: 'Логин не верный'
          });
        }

        if (!user) {
          return done(null, false, {
            message: 'Логин не верный'
          });
        } else {
          if (!user.checkPassword(password)) {
            return done(null, false, {
              message: 'Пароль не верный'
            });
          } else {
            return done(null, user);
          }
        }


      });
    }));

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: jwtsecret
  };

  passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
    console.log(payload, 'payload')
    userModel.findById(payload.id, (err, user) => {
      // if (err) {
      //   return done(err)
      // }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }));

}


module.exports = makePassport;