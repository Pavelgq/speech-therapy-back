const {
    Router
  } = require(`express`);
  const multer = require(`multer`);
  const jwt = require('jsonwebtoken'); 
  const async = require(`../utils/async`);
//   const dataRenderer = require(`../utils/data-renderer`);
  const userModel = require(`./user-model`);
  const passport = require('../routes/passport');
  const logger = require(`../logger/logger`);
  const jwtsecret = require('../secret/jwtsecret');
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
  
  userRouter.get('/',(req,res,next)=>{
    //Создадим новый handler который сидить по пути `/`
    res.send('Hello, World!');
    // Отправим привет миру!
});

  userRouter.post(`/auth`, async (req, res) => {
    try {
      const result =  await userModel.create(req.body);
      console.log(result);
      res.redirect('/api/user/');
    } catch (error) {
      res.status = 400;
      res.body = error;
      console.log(error);
      logger.error(error);
    }
    
  });

  userRouter.get('/auth', function (req, res, next) {
    console.log('the response will be sent by the next function ...');
    next();
  }, function (req, res) {
    res.send('Hello from B!');
  });

  userRouter.post('/login', async((async (req, res, next) => {
    await passport.authenticate('local', function (err, user) {
      if (user == false) {
        console.log("login failed")
        res.body = "Login failed";
      } else {
        //--payload - info to put in the JWT
        const payload = {
          id: user.id,
          displayName: user.displayName,
          email: user.email
        };
        const token = jwt.sign(payload, jwtsecret); //JWT is created here
  
        res.body = {user: user.displayName, token: 'JWT ' + token};
      }
    })(req, res, next);
  
  })));

  userRouter.get('/custom', async(req, res, next) => {
    
    await passport.authenticate('jwt', function (err, user) {
      if (user) {
        res.body = "hello " + user.displayName;
      } else {
        res.body = "No such user";
        console.log("err", err)
      }
    } )(req, res, next)

  });


  module.exports = userRouter;

  
//   module.exports = (userStore, imageStore) => {
//     chatRouter.userStore = userStore;
//     chatRouter.imageStore = imageStore;
//     return chatRouter;
//   }