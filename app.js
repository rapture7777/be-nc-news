const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter');
const {
  handle400s,
  handleDB404s,
  handle404s,
  handle500s
} = require('./errors');

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', handle404s);

app.use(handle400s);
app.use(handleDB404s);
app.use(handle500s);

module.exports = app;
