const express = require('express');
const app = express();
const cors = require('cors');
const apiRouter = require('./routers/apiRouter');
const {
  handle400s,
  handleDB404s,
  handle404s,
  handle500s
} = require('./errors');

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.use(handle400s);
app.use(handleDB404s);
app.use(handle500s);
app.all('/*', handle404s);

module.exports = app;
