const {
    Router
  } = require(`express`);
  const multer = require(`multer`);
  const jwt = require('jsonwebtoken');
  const async = require(`../utils/async`);
  //   const dataRenderer = require(`../utils/data-renderer`);
  const lessonModel = require(`./lesson-model`);
  const passport = require('passport');
  const logger = require(`../logger/logger`);
  const jwtsecret = require('../secret/jwtsecret');
  const e = require('express');
  //   const createStreamFromBuffer = require(`../utils/buffer-to-stream`);
  
  
  const lessonRouter = new Router();
  
  const toPage = async (cursor, skip = 0, limit = 20) => {
    return {
      data: await (cursor.skip(skip).limit(limit).toArray()),
      skip,
      limit,
      total: await cursor.count()
    };
  };
  
  lessonRouter.use((req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
    res.header('Access-Control-Allow-Credentials', 'true')
 
    next();
  });
  
  const upload = multer({
    storage: multer.memoryStorage()
  });
  
  lessonRouter.post(`/save`, async (req, res) => {
    try {
      const result = await lessonModel.create(req.body);
      console.log(result);
      res.send(result);
    } catch (error) {
      res.status = 400;
      console.log(error);
      logger.error(error);
      res.send(error);
    }
  
  });

  lessonRouter.post(`/during`, async (req, res) => {
    await passport.authenticate('local', function (err, user) {
        if (user && user.role == 'Admin') {
            const dateFrom = req.body.dateFrom;
            const dateTo = req.body.dateTo;

            lessonModel.find({"created_on": {"$gte": new Date(dateFrom), "$lt": new Date(dateTo)}})
           
        } else {
    
          res.send();
        }
      })(req, res, next);  
  });

  module.exports = lessonRouter;