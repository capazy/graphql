const Project = require('../../models/project');
const User = require('../../models/user');
const Vacancy = require('../../models/vacancy');
const Join = require('../../models/join');
const { transformProject } = require('./merge');

const projects = async ({ skill }) => {
  try {
    let projects;
    if (skill) {
      projects = await Project.find({ skills: skill })
        .collation({
          locale: 'en',
          strength: 2,
        })
        .sort({ createdAt: -1 });
    } else {
      projects = await Project.find().sort({ createdAt: -1 });
    }
    return projects.map((project) => {
      return transformProject(project);
    });
  } catch (error) {
    throw error;
  }
};

const createProject = async (
  { projectInput: { title, description, type, deadline, published } },
  { isAuth, userId }
) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  const project = new Project({
    title,
    description,
    type,
    deadline,
    published,
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
    const vacancies = await Vacancy.find({ _id: { $in: project.vacancies } });
    await vacancies.map(async (vacancy) => {
      await Vacancy.findByIdAndRemove(vacancy.id);
    });
    const joins = await Join.find({ project: projectId });
    await joins.map(async (join) => {
      await Join.findByIdAndRemove(join.id);
    });
    await Project.findByIdAndRemove(projectId);
    return transformProject(project);
  } catch (error) {
    throw error;
  }
};

module.exports = { projects, createProject, cancelProject };
