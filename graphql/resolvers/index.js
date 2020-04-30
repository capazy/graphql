const userResolver = require('./user');
const projectResolver = require('./project');
const joinResolver = require('./join');

const rootResolver = {
  ...userResolver,
  ...projectResolver,
  ...joinResolver,
};

module.exports = rootResolver;
