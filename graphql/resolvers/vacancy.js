const Project = require('../../models/project');
const Vacancy = require('../../models/vacancy');
const {
  transformProject,
  transformJoin,
  transformVacancy,
} = require('./merge');

const vacancies = async () => {
  try {
    const vacancies = await Vacancy.find();
    return vacancies.map((vacancy) => {
      return transformVacancy(vacancy);
    });
  } catch (error) {
    throw error;
  }
};

const createVacancy = async (
  { vacancyInput: { projectId, skills } },
  { isAuth, userId }
) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const fetchedProject = await Project.findById(projectId);
    if (fetchedProject.creator.toString() !== userId) {
      throw new Error('Unauthorized');
    }
    const vacancy = new Vacancy({
      project: fetchedProject,
      skills: skills,
    });
    fetchedProject.vacancies.push(vacancy.id);
    await fetchedProject.save();
    const result = await vacancy.save();
    return transformVacancy(result);
  } catch (error) {
    throw error;
  }
};

// const cancelJoin = async (args, { isAuth, userId }) => {
//   if (!isAuth) {
//     throw new Error('Unauthenticated');
//   }
//   try {
//     const join = await Join.findById(args.joinId).populate('project');
//     const project = await Project.findById(join.project.id);
//     const removeUser = project.joinedUsers.find(
//       (user) => user.toString() === userId
//     );
//     const index = project.joinedUsers.indexOf(removeUser);
//     await project.joinedUsers.splice(index, 1);
//     await project.save();
//     await Join.findByIdAndRemove(args.joinId);
//     return transformProject(project);
//   } catch (error) {
//     throw error;
//   }
// };

module.exports = { vacancies, createVacancy };
