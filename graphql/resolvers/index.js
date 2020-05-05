const userResolver = require('./user');
const projectResolver = require('./project');
const joinResolver = require('./join');
const vacancyResolver = require('./vacancy');

const rootResolver = {
  ...userResolver,
  ...projectResolver,
  ...joinResolver,
  ...vacancyResolver,
};

module.exports = rootResolver;
