const knex = require('../db/connection');

exports.fetchTopics = () => {
  return knex('topics').select('slug', 'description');
};

exports.fetchUser = ({ username }) => {
  return knex('users')
    .select('username', 'avatar_url', 'name')
    .where('username', username)
    .then(user => {
      if (!user.length)
        return Promise.reject({ status: 404, msg: 'User not found...' });
      else return user[0];
    });
};

exports.fetchUsers = () => {
  return knex('users').select('*');
};

exports.createUser = user => {
  return knex('users')
    .insert(user)
    .returning('*')
    .then(user => user[0]);
};

exports.fetchArticle = ({ article_id }) => {
  return knex('articles')
    .select('articles.*')
    .where('articles.article_id', article_id)
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .count({ comment_count: 'comments.article_id' })
    .then(article => {
      if (!article.length)
        return Promise.reject({ status: 404, msg: 'Article not found...' });
      else return article[0];
    });
};

exports.fetchArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  limit = 10,
  page = 1,
  author,
  topic
}) => {
  let fullArticles = knex('articles')
    .select('articles.*')
    .count({ comment_count: 'comments.article_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .orderBy(sort_by, order)
    .groupBy('articles.article_id')
    .modify(articles => {
      if (topic) articles.where('topic', topic);
      if (author) articles.where('articles.author', author);
    })
    .then(articles => {
      return articles.length
        ? articles
        : Promise.reject({
            status: 404,
            msg:
              'Query value does not exist or no articles exist for specified query...'
          });
    });

  let limitedArticles = knex('articles')
    .select('articles.*')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count({ comment_count: 'comments.article_id' })
    .orderBy(sort_by, order)
    .limit(limit)
    .offset(limit * page - limit)
    .modify(articles => {
      if (topic) articles.where('topic', topic);
      if (author) articles.where('articles.author', author);
    })
    .then(articles => {
      return articles.length
        ? articles
        : Promise.reject({
            status: 404,
            msg:
              'Query value does not exist or no articles exist for specified query...'
          });
    });
  return Promise.all([fullArticles, limitedArticles]);
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

exports.createArticle = article => {
  return knex('articles')
    .insert(article)
    .returning('*')
    .then(article => article[0]);
};

exports.removeArticle = ({ article_id }) => {
  return knex('articles')
    .delete()
    .where('article_id', article_id)
    .then(deleteCount => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: 'Article not found...' });
      else return deleteCount;
    });
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
  { sort_by = 'created_at', order = 'desc', limit = 10, page = 1 }
) => {
  return knex('comments')
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .where('article_id', article_id)
    .orderBy(sort_by, order)
    .limit(limit)
    .offset(limit * page - limit)
    .then(comments => {
      if (!comments.length) {
        return knex('articles')
          .select('*')
          .where('article_id', article_id)
          .then(article => {
            if (article.length !== 0) return comments;
            else
              return Promise.reject({
                status: 404,
                msg: 'Comment(s) not found...'
              });
          });
      } else return comments;
    });
};

exports.updateComment = ({ comment_id }, { inc_votes }) => {
  return knex('comments')
    .select('votes')
    .where('comment_id', comment_id)
    .then(votes => {
      if (!votes.length)
        return Promise.reject({ status: 404, msg: 'Comment not found...' });
      let newVotes = votes[0].votes + inc_votes;
      return knex('comments')
        .where('comment_id', comment_id)
        .update('votes', newVotes)
        .returning('*');
    })
    .then(comment => comment[0]);
};

exports.removeComment = ({ comment_id }) => {
  return knex('comments')
    .delete()
    .where('comment_id', comment_id)
    .then(deleteCount => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: 'Comment not found...' });
      else return deleteCount;
    });
};

exports.createTopic = topic => {
  return knex('topics')
    .insert(topic)
    .returning('*')
    .then(topic => topic[0]);
};
