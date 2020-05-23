const Project = require('../../models/project');
const Vacancy = require('../../models/vacancy');
const Join = require('../../models/join');
const { transformVacancy } = require('./merge');

const vacancies = async ({ projectId }) => {
  try {
    const vacancies = await Vacancy.find({ project: projectId });
    return vacancies.map((vacancy) => {
      return transformVacancy(vacancy);
    });
  } catch (error) {
    throw error;
  }
};

const createVacancy = async (
  {
    vacancyInput: {
      projectId,
      title,
      experience,
      skills,
      timeCommitment,
      timeCommitmentUnits,
    },
  },
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
      title,
      experience,
      skills,
      timeCommitment,
      timeCommitmentUnits,
    });
    fetchedProject.vacancies.push(vacancy.id);
    skills.map((skill) => {
      fetchedProject.skills.push(skill);
    });
    await fetchedProject.save();
    const result = await vacancy.save();
    return transformVacancy(result);
  } catch (error) {
    throw error;
  }
};

const cancelVacancy = async ({ vacancyId }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const vacancy = await Vacancy.findById(vacancyId);
    const project = await Project.findById(vacancy.project);
    if (project.creator.toString() !== userId) {
      throw new Error('Unauthorized');
    }
    const removeUser = project.vacancies.find(
      (vacancy) => vacancy.toString() === vacancyId
    );
    const index = project.vacancies.indexOf(removeUser);
    await project.vacancies.splice(index, 1);
    await project.save();
    await Vacancy.findByIdAndRemove(vacancyId);
    await Join.findOneAndDelete({ vacancy: vacancyId });
    return transformVacancy(vacancy);
  } catch (error) {
    throw error;
  }
};

const selectUser = async (
  { selectedUserId, vacancyId },
  { isAuth, userId }
) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const project = await Project.findOne({ vacancies: vacancyId });
    if (project.creator.toString() !== userId) {
      throw new Error('Unauthorized');
    }
    const vacancy = await Vacancy.findById(vacancyId);
    const join = await Join.findOne({
      user: selectedUserId,
      vacancy: vacancyId,
    });
    vacancy.selectedUser = selectedUserId;
    join.status = 'selected';
    join.save();
    const result = await vacancy.save();
    return transformVacancy(result);
  } catch (error) {
    throw error;
  }
};

module.exports = { vacancies, createVacancy, cancelVacancy, selectUser };
