const Project = require('../../models/project');
const User = require('../../models/user');
const Vacancy = require('../../models/vacancy');
const { dateToString } = require('../../helpers');

// vacancy
const singleVacancy = async (vacancyId) => {
  try {
    const vacancy = await Vacancy.findById(vacancyId);
    return {
      ...vacancy._doc,
      postulatedUsers: users.bind(this, vacancy.postulatedUsers),
      project: singleProject.bind(this, vacancy.project),
    };
  } catch (error) {
    throw error;
  }
};

const vacancies = async (vacancyIds) => {
  try {
    const vacancies = await Vacancy.find({ _id: { $in: vacancyIds } });
    return vacancies.map((vacancy) => {
      return transformVacancy(vacancy);
    });
  } catch (error) {
    throw error;
  }
};

// project
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

// User
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

// transform fuctions
const transformProject = (project) => {
  return {
    ...project._doc,
    creator: singleUser.bind(this, project.creator),
    vacancies: vacancies.bind(this, project.vacancies),
    deadline: dateToString(project.deadline),
    createdAt: dateToString(project.createdAt),
    updatedAt: dateToString(project.updatedAt),
  };
};

const transformJoin = (join) => {
  return {
    ...join._doc,
    user: singleUser.bind(this, join.user),
    project: singleProject.bind(this, join.project),
    vacancy: singleVacancy.bind(this, join.vacancy),
    createdAt: dateToString(join.createdAt),
    updatedAt: dateToString(join.updatedAt),
  };
};

const transformVacancy = (vacancy) => {
  return {
    ...vacancy._doc,
    project: singleProject.bind(this, vacancy.project),
    postulatedUsers: users.bind(this, vacancy.postulatedUsers),
    createdAt: dateToString(vacancy.createdAt),
    updatedAt: dateToString(vacancy.updatedAt),
  };
};

module.exports = {
  projects,
  vacancies,
  transformProject,
  transformJoin,
  transformVacancy,
};
