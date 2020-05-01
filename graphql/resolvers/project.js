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

const createProject = async (
  { projectInput: { title, description, price, date } },
  { isAuth, userId }
) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  const project = new Project({
    title,
    description,
    price,
    date: new Date(date),
    creator: userId,
  });
  let createdProject;
  try {
    const result = await project.save();
    createdProject = transformProject(result);
    const creator = await User.findById(userId);
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

const cancelProject = async ({ projectId }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const project = await Project.findById(projectId);
    if (project.creator.toString() !== userId) {
      throw new Error('Unauthorized');
    }
    await Project.findByIdAndRemove(projectId);
    return transformProject(project);
  } catch (error) {
    throw error;
  }
};

module.exports = { projects, createProject, cancelProject };
