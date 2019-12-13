process.env.NODE_ENV = 'test';
const request = require('supertest');
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
const app = require('../app');
const connection = require('../db/connection');

chai.use(chaiSorted);

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
            expect(msg).to.equal('Not found...');
          });
      });
    });
    describe('INVALID METHODS', () => {
      it('status: 405 invalid method used', () => {
        const methods = ['post', 'patch', 'put', 'delete'];
        const promises = methods.map(function(method) {
          return request(app)
            [method]('/api/users/1')
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
