const apiRouter = require('express').Router();
const { getTopics } = require('../controllers/getTopics');
const { handle405s } = require('../errors');

apiRouter
  .route('/topics')
  .get(getTopics)
  .all(handle405s);

module.exports = apiRouter;
