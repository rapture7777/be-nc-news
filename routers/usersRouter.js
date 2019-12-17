const usersRouter = require('express').Router();
const { getUser } = require('../controllers');
const { handle405s } = require('../errors');

usersRouter
  .route('/:username')
  .get(getUser)
  .all(handle405s);

module.exports = usersRouter;
