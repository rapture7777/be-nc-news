const ENV = process.env.NODE_ENV || 'development';
const testData = require('./test-data');
const devData = require('./development-data');

let dataObj = {
  test: testData,
  development: devData
};

module.exports = dataObj[ENV];
