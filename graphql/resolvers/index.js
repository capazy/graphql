const userResolver = require('./user');
const projectResolver = require('./project');
const joinResolver = require('./join');
const vacancyResolver = require('./vacancy');
const jobResolver = require('./job');

const rootResolver = {
  ...userResolver,
  ...projectResolver,
  ...joinResolver,
  ...vacancyResolver,
  ...jobResolver,
};

module.exports = rootResolver;
