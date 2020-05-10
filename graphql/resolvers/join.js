const User = require('../../models/user');
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

const joinVacancy = async ({ vacancyId }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const user = await User.findById(userId);
    const fetchedVacancy = await Vacancy.findById(vacancyId);
    const fetchedProject = await Project.findById(fetchedVacancy.project);
    const join = new Join({
      user: userId,
      project: fetchedProject,
      vacancy: fetchedVacancy,
    });
    await user.joinedProjects.push(vacancyId);
    await fetchedVacancy.postulatedUsers.push(userId);
    user.save();
    fetchedVacancy.save();
    const result = await join.save();
    return transformJoin(result);
  } catch (error) {
    throw error;
  }
};

const cancelJoin = async ({ joinId }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const join = await Join.findById(joinId);
    const vacancy = await Vacancy.findById(join.vacancy);
    const removeUser = vacancy.postulatedUsers.find(
      (user) => user.toString() === userId
    );
    const index = vacancy.postulatedUsers.indexOf(removeUser);
    await vacancy.postulatedUsers.splice(index, 1);
    await vacancy.save();
    await Join.findByIdAndRemove(joinId);
    return transformVacancy(vacancy);
  } catch (error) {
    throw error;
  }
};

module.exports = { joins, joinVacancy, cancelJoin };
