const { fetchTopics, fetchUser, fetchArticle } = require('../models');

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
