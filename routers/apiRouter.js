const apiRouter = require('express').Router();
const { getTopics, getUser } = require('../controllers');
const { handle405s } = require('../errors');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter
  .route('/topics')
  .get(getTopics)
  .all(handle405s);

apiRouter
  .route('/users/:username')
  .get(getUser)
  .all(handle405s);

module.exports = apiRouter;
