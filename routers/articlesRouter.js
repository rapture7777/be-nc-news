const articlesRouter = require('express').Router();
const {
  getArticle,
  patchArticle,
  postComment,
  getComments,
  getArticles,
  postArticle,
  deleteArticle
} = require('../controllers');
const { handle405s } = require('../errors');

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle)
  .delete(deleteArticle)
  .all(handle405s);

articlesRouter
  .route('/:article_id/comments')
  .post(postComment)
  .get(getComments)
  .all(handle405s);

articlesRouter
  .route('/')
  .get(getArticles)
  .post(postArticle)
  .all(handle405s);

module.exports = articlesRouter;
