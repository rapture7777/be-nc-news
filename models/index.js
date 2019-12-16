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
      if (!user.length)
        return Promise.reject({ status: 404, msg: 'User not found...' });
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

exports.updateArticle = ({ article_id }, { inc_votes }) => {
  return knex('articles')
    .select('votes')
    .where('article_id', article_id)
    .then(votes => {
      let newVotes = votes[0].votes + inc_votes;
      return knex('articles')
        .where('article_id', article_id)
        .update('votes', newVotes)
        .returning('*');
    })
    .then(article => article[0]);
};

exports.createComment = ({ article_id }, comment) => {
  let newComment = {
    author: comment.username,
    article_id: article_id,
    body: comment.body
  };
  return knex('comments')
    .insert(newComment)
    .returning('*')
    .then(comment => comment[0]);
};

exports.fetchComments = (
  { article_id },
  { sort_by = 'created_at', order = 'desc' }
) => {
  return knex('comments')
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .where('article_id', article_id)
    .orderBy(sort_by, order)
    .then(comments => {
      if (!comments.length) return Promise.reject({ msg: 'Not found...' });
      else return comments;
    });
};

exports.fetchArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic
}) => {
  return knex('articles')
    .select(
      'articles.author',
      'articles.title',
      'articles.article_id',
      'topic',
      'articles.created_at',
      'articles.votes'
    )
    .join('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id', 'comments.article_id')
    .count({ comment_count: 'comments.article_id' })
    .orderBy(`articles.${sort_by}`, order)
    .modify(articles => {
      if (author) articles.where('articles.author', author);
      if (topic) articles.where('articles.topic', topic);
    })
    .then(articles => articles);
};
