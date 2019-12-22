const {
  fetchTopics,
  fetchUser,
  fetchUsers,
  fetchArticle,
  updateArticle,
  createComment,
  fetchComments,
  fetchArticles,
  updateComment,
  removeComment,
  createArticle,
  removeArticle,
  createTopic
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

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then(users => {
      res.status(200).send({ users });
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

exports.postArticle = (req, res, next) => {
  createArticle(req.body)
    .then(article => {
      res.status(201).send({ article });
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

exports.deleteArticle = (req, res, next) => {
  removeArticle(req.params)
    .then(() => {
      res.sendStatus(204);
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
      res
        .status(200)
        .send({ articles: articles[1], total_count: articles[0].length });
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

exports.postTopic = (req, res, next) => {
  createTopic(req.body)
    .then(topic => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
