# Northcoders News Back-end Project

This project is the API required for the Northcoders News front-end project. It was completed as part of the back-end module review as part of the Northcoders Leeds JavaScript Coding Bootcamp.

[This is the link to the site hosted on Heroku.](https://nc-news-asv.herokuapp.com)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

These are the dependencies required to run the API:

```js
"dependencies": {
"express": "^4.17.1",
"knex": "^0.20.4",
"pg": "^7.14.0"
},

"devDependencies": {
"chai": "^4.2.0",
"chai-sorted": "^0.2.0",
"mocha": "^6.2.2",
"supertest": "^4.0.2"
}
```

### Installing

Clone this repository and cd into ./be-nc-news

To get the dependencies up and running simply start with:

```bash
npm i
```

Next, to setup the database:

```bash
npm run setup_dbs && npm run migrate-latest && npm run seed
```

To start requesting from the API using [localhost:9090/api](localhost:9090/api) and your preferred client:

```bash
npm run start
```

To view a list of all the available end-points and a description of how they can be used:

```
GET /api
```

## Running the tests

To run the tests on the API, which are categorised by endpoint and request method:

```bash
npm t
```

## Built With

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [Knex.js](http://knexjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)
- [Chai-Sorted](https://www.npmjs.com/package/chai-sorted)
- [Supertest](https://www.npmjs.com/package/supertest)

## Authors

Adam Valentine
