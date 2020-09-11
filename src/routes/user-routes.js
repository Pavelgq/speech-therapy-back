const {
  Router
} = require(`express`);
const multer = require(`multer`);
const jwt = require('jsonwebtoken');
const async = require(`../utils/async`);
//   const dataRenderer = require(`../utils/data-renderer`);
const userModel = require(`./user-model`);
const passport = require('passport');
const logger = require(`../logger/logger`);
const jwtsecret = require('../secret/jwtsecret');
const e = require('express');
//   const createStreamFromBuffer = require(`../utils/buffer-to-stream`);


const userRouter = new Router();

const toPage = async (cursor, skip = 0, limit = 20) => {
  return {
    data: await (cursor.skip(skip).limit(limit).toArray()),
    skip,
    limit,
    total: await cursor.count()
  };
};

userRouter.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
});

const upload = multer({
  storage: multer.memoryStorage()
});

userRouter.get('/', (req, res, next) => {
  //Создадим новый handler который сидить по пути `/`
  res.send('Hello, World!');
  // Отправим привет миру!
});

userRouter.post(`/auth`, async (req, res) => {
  try {
    const result = await userModel.create(req.body);
    console.log(result);
    res.send(result);
  } catch (error) {
    res.status = 400;
    console.log(error);
    logger.error(error);
    res.send(error);
  }

});

userRouter.post('/login', async ((async (req, res, next) => {
  await passport.authenticate('local', function (err, user) {

    if (user == false) {
      console.log("login failed")
      res.send("Login failed");
    } else {
      //--payload - info to put in the JWT
      const payload = {
        id: user.id,
        login: user.login,
        email: user.email
      };
      const token = jwt.sign(payload, jwtsecret); //JWT is created here


      res.send({
        role: user.role,
        user: user.login,
        token: 'JWT ' + token
      });
    }
  })(req, res, next);

})));

/**
 * Запрос проверяет наличие валидного JWT
 */
userRouter.get('/custom', async (req, res, next) => {

  await passport.authenticate('jwt', function (err, user) {
    console.log(user, "user");
    if (user) {
      res.send("hello " + user.login);
    } else {
      res.send("No such user");
      console.log("err", err)
    }
  })(req, res, next)

});

/**
 * Запрос на изменения данных пользователя
 */
userRouter.post('/change', async (req, res, next) => {
  await passport.authenticate('jwt', function (err, user) {
      if ((user.login == req.body.login) || (user && user.role == admin)) {
        //тут будут изменяться данные пользователя;
      } else {
        res.send("No access");
        console.log("err", err);
      }
  })(req, res, next)
})

/**
 * Запрос на удаление пользователя из базы
 */
userRouter.delete('/remove', async (req, res, next) => {
  await passport.authenticate('jwt', function (err, user) {
    if (user && user.role == 'admin') {
      userModel.deleteOne({
        login: req.body.ghostUser
      }, function (err) {});
      res.send("user " + req.body.ghostUser + " deleted");
    } else {
      res.send("No access");
      console.log("err", err)
    }

  })(req, res, next)
})

module.exports = userRouter;


//   module.exports = (userStore, imageStore) => {
//     chatRouter.userStore = userStore;
//     chatRouter.imageStore = imageStore;
//     return chatRouter;
//   }