const userResolver = require('./user');
const projectResolver = require('./project');
const joinResolver = require('./join');
const vacancyResolver = require('./vacancy');
const jobResolver = require('./job');
const emailResolver = require('./email');

const rootResolver = {
  ...userResolver,
  ...projectResolver,
  ...joinResolver,
  ...vacancyResolver,
  ...jobResolver,
  ...emailResolver,
};

module.exports = rootResolver;
