const {
  fetchTopics,
  fetchUser,
  fetchArticle,
  updateArticle,
  createComment,
  fetchComments,
  fetchArticles,
  updateComment,
  removeComment
} = require('../models');
const endpoints = require('../endpoints.json');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  fetchUser(req.params)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  fetchArticle(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  updateArticle(req.params, req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  createComment(req.params, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  fetchComments(req.params, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  updateComment(req.params, req.body)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  removeComment(req.params)
    .then(() => res.sendStatus(204))
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};
