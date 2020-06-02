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
    throw new Error('Oops, something went wrong. Please try again later.');
  }
};

const projectById = async (args, { isAuth }) => {
  try {
    if (!isAuth) {
      throw new Error('Unauthenticated');
    }
    const { projectId } = args;
    const project = await Project.findById(projectId).sort({ createdAt: -1 });

    return transformProject(project);
  } catch (error) {
    throw new Error('Oops, something went wrong. Please try again later.');
  }
};

const createProject = async (
  { projectInput: { title, description, type, startDate, endDate } },
  { isAuth, userId }
) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  const project = new Project({
    title,
    description,
    type,
    startDate,
    endDate,
    creator: userId,
  });
  try {
    const user = await User.findById(userId);
    user.createdProjects.unshift(project);
    user.save();
    const result = await project.save();
    return transformProject(result);
  } catch (error) {
    throw new Error('Oops, something went wrong. Please try again later.');
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
    throw new Error('Oops, something went wrong. Please try again later.');
  }
};

const updateProject = async ({ projectInput }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const project = await Project.findOneAndUpdate(
      { _id: projectInput.projectId },
      { [projectInput.method]: projectInput },
      { new: true }
    );
    return transformProject(project);
  } catch (error) {
    throw new Error('Oops, something went wrong. Please try again later.');
  }
};

const deleteProjectFile = async ({ projectId, fileId }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  const project = await Project.findById(projectId);
  const deleteFile = project.files.find(
    (file) => file._id.toString() === fileId
  );
  const index = project.files.indexOf(deleteFile);
  await project.files.splice(index, 1);
  const result = await project.save();
  return transformProject(result);
};

module.exports = {
  projects,
  createProject,
  cancelProject,
  updateProject,
  projectById,
  deleteProjectFile,
};
