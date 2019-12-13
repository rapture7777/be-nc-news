const apiRouter = require('express').Router();
const { getTopics, getUser } = require('../controllers');
const { handle405s } = require('../errors');

apiRouter
  .route('/topics')
  .get(getTopics)
  .all(handle405s);

apiRouter
  .route('/users/:username')
  .get(getUser)
  .all(handle405s);

module.exports = apiRouter;
