const Project = require('../../models/project');
const User = require('../../models/user');
const { transformProject } = require('./merge');

const projects = async () => {
  try {
    const projects = await Project.find();
    return projects.map((project) => {
      return transformProject(project);
    });
  } catch (error) {
    throw error;
  }
};

const createProject = async (args, req) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated');
  }
  const project = new Project({
    title: args.projectInput.title,
    description: args.projectInput.description,
    price: +args.projectInput.price,
    date: new Date(args.projectInput.date),
    creator: req.userId,
  });
  let createdProject;
  try {
    const result = await project.save();
    createdProject = transformProject(result);
    const creator = await User.findById(req.userId);
    if (!creator) {
      throw new Error('User not found.');
    }
    creator.createdProjects.push(project);
    await creator.save();
    return createdProject;
  } catch (error) {
    throw error;
  }
};

const cancelProject = async (args, req) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const project = await Project.findByIdAndRemove(args.projectId);
    return transformProject(project);
  } catch (error) {
    throw error;
  }
};

module.exports = { projects, createProject, cancelProject };
