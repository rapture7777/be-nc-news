process.env.NODE_ENV = 'test';
const request = require('supertest');
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
const app = require('../app');
const connection = require('../db/connection');

chai.use(chaiSorted);

beforeEach(() => connection.seed.run());

after(() => {
  connection.destroy();
});

describe('ERROR: Invalid Path', () => {
  it('status: 404 not found when an invalid path is specified', () => {
    return request(app)
      .get('/a')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal('No such path...');
      });
  });
});
describe('/api', () => {
  describe('/', () => {
    describe('GET', () => {
      it('status 200 returns the endpoints', () => {
        return request(app)
          .get('/api')
          .expect(200)
          .then(({ body: { endpoints } }) => {
            expect(endpoints).to.be.an('object');
          });
      });
    });
  });
  describe('/topics', () => {
    describe('GET', () => {
      it('status: 200 returns all topics with slug and description keys', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.be.an('array');
            expect(topics[0]).to.have.keys('slug', 'description');
          });
      });
    });
    describe('INVALID METHODS', () => {
      it('status: 405 invalid method used', () => {
        const methods = ['post', 'patch', 'put', 'delete'];
        const promises = methods.map(function(method) {
          return request(app)
            [method]('/api/topics')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Invalid method...');
            });
        });
        return Promise.all(promises);
      });
    });
  });
  describe('/users/:username', () => {
    describe('GET', () => {
      it('status: 200 returns a user object containing username, avatar_url and name for speicified username', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.be.an('array');
            expect(user[0]).to.have.keys('username', 'avatar_url', 'name');
            expect(user[0].username).to.equal('butter_bridge');
          });
      });
      it('status: 404 username not found', () => {
        return request(app)
          .get('/api/users/holy_diver')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('User not found...');
          });
      });
    });
    describe('INVALID METHODS', () => {
      it('status: 405 invalid method used', () => {
        const methods = ['post', 'patch', 'put', 'delete'];
        const promises = methods.map(function(method) {
          return request(app)
            [method]('/api/users/john')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Invalid method...');
            });
        });
        return Promise.all(promises);
      });
    });
  });
  describe('/articles/:article_id', () => {
    describe('GET', () => {
      it('status: 200 returns a article object containing author, title, article_id, body, topic, created_at, votes and comment_count for a specified article', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.be.an('object');
            expect(article).to.have.keys(
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            );
            expect(article.comment_count).to.equal('13');
          });
      });
      it('status: 400 invalid article_id', () => {
        return request(app)
          .get('/api/articles/abc')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request...');
          });
      });
      it('status: 404 id not found', () => {
        return request(app)
          .get('/api/articles/666')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Article not found...');
          });
      });
    });
    describe('PATCH', () => {
      it('status: 201 patches article with updated number of votes and returns the patched article', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 1 })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).to.be.an('object');
            expect(article).to.have.keys(
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'created_at',
              'votes'
            );
            expect(article.votes).to.equal(101);
          });
      });
      it('status: 400 request body is incorrectly formatted', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_vees: 'abc' })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request...');
          });
      });
      it('status: 400 invalid article_id', () => {
        return request(app)
          .patch('/api/articles/abc')
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request...');
          });
      });
      it('status: 404 id not found', () => {
        return request(app)
          .get('/api/articles/666')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Article not found...');
          });
      });
    });
    describe('INVALID METHODS', () => {
      it('status: 405 invalid method used', () => {
        const methods = ['post', 'put', 'delete'];
        const promises = methods.map(function(method) {
          return request(app)
            [method]('/api/articles/1')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Invalid method...');
            });
        });
        return Promise.all(promises);
      });
    });
  });
  describe('/articles/:article_id/comments', () => {
    describe('POST', () => {
      it('status: 201 adds a comment to the comments table referencing the article_id provided', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            username: 'butter_bridge',
            body: 'I think this article is a pile of crap.'
          })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an('object');
            expect(comment).to.have.keys(
              'comment_id',
              'author',
              'article_id',
              'votes',
              'created_at',
              'body'
            );
            expect(comment.body).to.equal(
              'I think this article is a pile of crap.'
            );
          });
      });
      it('status: 400 article_id not present in linked articles_table', () => {
        return request(app)
          .post('/api/articles/666/comments')
          .send({
            username: 'butter_bridge',
            body: 'I think this article is a pile of crap.'
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request...');
          });
      });
      it('status: 400 request body is incorrectly formatted', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            username: 123,
            bod: 'I think this article is a pile of crap.'
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request...');
          });
      });
      it('status: 400 invalid article_id', () => {
        return request(app)
          .post('/api/articles/abc/comments')
          .send({
            username: 123,
            bod: 'I think this article is a pile of crap.'
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request...');
          });
      });
    });
    describe('GET', () => {
      it('status: 200 returns all comments associated with the article_id provided', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an('array');
            expect(comments[0]).to.have.keys(
              'comment_id',
              'author',
              'votes',
              'created_at',
              'body'
            );
          });
      });
      it('status: 200 accepts sort_by query which an sort by any valid column, defaulting to created_at', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=author')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an('array');
            expect(comments).to.be.descendingBy('author');
            expect(comments[0]).to.have.keys(
              'comment_id',
              'author',
              'votes',
              'created_at',
              'body'
            );
          });
      });
      it('status: 200 accepts order query which will default to descending', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=author&order=asc')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an('array');
            expect(comments).to.be.ascendingBy('author');
            expect(comments[0]).to.have.keys(
              'comment_id',
              'author',
              'votes',
              'created_at',
              'body'
            );
          });
      });
      it('status: 400 invalid article_id', () => {
        return request(app)
          .get('/api/articles/abc/comments')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request...');
          });
      });
      it('status: 404 article_id does not exist/no comments found', () => {
        return request(app)
          .get('/api/articles/666/comments')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Comment(s) not found...');
          });
      });
    });
    describe('INVALID METHODS', () => {
      it('status: 405 invalid method used', () => {
        const methods = ['patch', 'put', 'delete'];
        const promises = methods.map(function(method) {
          return request(app)
            [method]('/api/articles/1/comments')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Invalid method...');
            });
        });
        return Promise.all(promises);
      });
    });
  });
  describe('/articles', () => {
    describe('GET', () => {
      it('status: 200 returns all articles each with author, title, article_id, topic, created_at, votes and comment_count', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
            expect(articles[0]).to.have.keys(
              'author',
              'title',
              'article_id',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            );
          });
      });
      it('status: 200 accepts sort_by and orders queries which default to date and desc respectively', () => {
        return request(app)
          .get('/api/articles?sort_by=author&order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
            expect(articles).to.be.ascendingBy('author');
          });
      });
      it('status: 200 accepts author and topic queries which filter the articles', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge&topic=mitch')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(3);
            expect(articles).to.be.descendingBy('created_at');
            expect(articles[0].author).to.equal('butter_bridge');
          });
      });
      it('status: 400 invalid query value', () => {
        return request(app)
          .get('/api/articles?sort_by=happy')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request...');
          });
      });
    });
    describe('INVALID METHODS', () => {
      it('status: 405 invalid method used', () => {
        const methods = ['patch', 'put', 'delete'];
        const promises = methods.map(function(method) {
          return request(app)
            [method]('/api/articles/1/comments')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Invalid method...');
            });
        });
        return Promise.all(promises);
      });
    });
  });
  describe('/comments/:comment_id', () => {
    describe('PATCH', () => {
      it('status: 201 updates the votes value of a specified comment and returns the updated comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 1 })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an('object');
            expect(comment.votes).to.equal(17);
          });
      });
      it('status: 400 invalid request body', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_voes: 'abc' })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request...');
          });
      });
      it('status: 400 invalid comment_id', () => {
        return request(app)
          .patch('/api/comments/abc')
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request...');
          });
      });
      it('status: 404 comment not found', () => {
        return request(app)
          .patch('/api/comments/888')
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Comment not found...');
          });
      });
    });
    describe('DELETE', () => {
      it('status: 204 deletes the specified comment', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204);
      });
      it('status: 400 invalid comment_id', () => {
        return request(app)
          .delete('/api/comments/abc')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request...');
          });
      });
      it('status: 404 comment not found', () => {
        return request(app)
          .delete('/api/comments/888')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Comment not found...');
          });
      });
    });
    describe('INVALID METHODS', () => {
      it('status: 405 invalid method used', () => {
        const methods = ['get', 'put', 'post'];
        const promises = methods.map(function(method) {
          return request(app)
            [method]('/api/comments/1')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Invalid method...');
            });
        });
        return Promise.all(promises);
      });
    });
  });
});
