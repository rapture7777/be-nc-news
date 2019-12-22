exports.handle400s = (err, req, res, next) => {
  const errorCodes = ['23505', '23502', '22P02', '42703'];
  if (errorCodes.includes(err.code))
    res.status(400).send({ msg: 'Bad request...' });
  else next(err);
};

exports.handleDB404s = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ msg: err.msg });
  else if (err.code === '23503') res.status(404).send({ msg: 'Not found...' });
  else next(err);
};

exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: 'No such path...' });
};

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: 'Invalid method...' });
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error...' });
};
