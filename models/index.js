const knex = require('../db/connection');

exports.fetchTopics = () => {
  return knex('topics')
    .select('slug', 'description')
    .then(topics => topics);
};

exports.fetchUser = ({ username }) => {
  return knex('users')
    .select('username', 'avatar_url', 'name')
    .where('username', username)
    .then(user => {
      if (!user.length) return Promise.reject({ msg: 'Not found...' });
      else return user;
    });
};

exports.fetchArticle = ({ article_id }) => {
  return knex('articles')
    .select(
      'articles.author',
      'title',
      'articles.article_id',
      'articles.body',
      'topic',
      'articles.created_at',
      'articles.votes'
    )
    .where('articles.article_id', article_id)
    .join('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('comments.article_id', 'articles.article_id')
    .count({ comment_count: 'comments.article_id' })
    .then(article => {
      if (!article.length) return Promise.reject({ msg: 'Not found...' });
      else return article[0];
    });
};
