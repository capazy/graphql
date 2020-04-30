const Project = require('../../models/project');
const User = require('../../models/user');
const { dateToString } = require('../../helpers');

const singleProject = async (projectId) => {
  try {
    const project = await Project.findById(projectId);
    return {
      ...project._doc,
      creator: singleUser.bind(this, project.creator),
    };
  } catch (error) {
    throw error;
  }
};

const projects = async (projectIds) => {
  try {
    const projects = await Project.find({ _id: { $in: projectIds } });
    return projects.map((project) => {
      return transformProject(project);
    });
  } catch (error) {
    throw error;
  }
};

const singleUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdProjects: projects.bind(this, user.createdProjects),
    };
  } catch (error) {
    throw error;
  }
};

const users = async (userIds) => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    return users.map((user) => {
      return singleUser(user.id);
    });
  } catch (error) {
    throw error;
  }
};

const transformProject = (project) => {
  return {
    ...project._doc,
    date: dateToString(project.date),
    creator: singleUser.bind(this, project.creator),
    joinedUsers: users.bind(this, project.joinedUsers),
  };
};

const transformJoin = (join) => {
  return {
    ...join._doc,
    user: singleUser.bind(this, join.user),
    project: singleProject.bind(this, join.project),
    createdAt: dateToString(join.createdAt),
    updatedAt: dateToString(join.updatedAt),
  };
};

module.exports = { projects, transformProject, transformJoin };
