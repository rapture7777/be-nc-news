const usersRouter = require('express').Router();
const { getUser, getUsers, postUser } = require('../controllers');
const { handle405s } = require('../errors');

usersRouter
  .route('/:username')
  .get(getUser)
  .all(handle405s);

usersRouter
  .route('/')
  .get(getUsers)
  .post(postUser)
  .all(handle405s);

module.exports = usersRouter;
