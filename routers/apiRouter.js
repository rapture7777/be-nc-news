const apiRouter = require('express').Router();
const { getEndpoints } = require('../controllers');
const { handle405s } = require('../errors');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

apiRouter
  .route('/')
  .get(getEndpoints)
  .all(handle405s);

module.exports = apiRouter;
