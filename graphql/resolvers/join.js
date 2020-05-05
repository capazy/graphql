const Project = require('../../models/project');
const Join = require('../../models/join');
const Vacancy = require('../../models/vacancy');
const { transformVacancy, transformJoin } = require('./merge');

const joins = async () => {
  try {
    const joins = await Join.find();
    return joins.map((join) => {
      return transformJoin(join);
    });
  } catch (error) {
    throw error;
  }
};

const joinProject = async ({ vacancyId }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const fetchedVacancy = await Vacancy.findById(vacancyId);
    const fetchedProject = await Project.findById(fetchedVacancy.project);
    const join = new Join({
      user: userId,
      project: fetchedProject,
      vacancy: fetchedVacancy,
    });
    fetchedVacancy.postulatedUsers.push(userId);
    await fetchedVacancy.save();
    const result = await join.save();
    return transformJoin(result);
  } catch (error) {
    throw error;
  }
};

const cancelJoin = async (args, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const join = await Join.findById(args.joinId).populate('vacancy');
    const vacancy = await Vacancy.findById(join.vacancy);
    const removeUser = vacancy.postulatedUsers.find(
      (user) => user.toString() === userId
    );
    const index = vacancy.postulatedUsers.indexOf(removeUser);
    await vacancy.postulatedUsers.splice(index, 1);
    await vacancy.save();
    await Join.findByIdAndRemove(args.joinId);
    return transformVacancy(vacancy);
  } catch (error) {
    throw error;
  }
};

module.exports = { joins, joinProject, cancelJoin };
