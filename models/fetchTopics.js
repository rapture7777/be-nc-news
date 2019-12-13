const knex = require('../db/connection');

exports.fetchTopics = () => {
  return knex('topics')
    .select('*')
    .then(topics => topics);
};
