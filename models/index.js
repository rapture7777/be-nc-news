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
