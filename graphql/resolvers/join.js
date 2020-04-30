const Project = require('../../models/project');
const Join = require('../../models/join');
const { transformProject, transformJoin } = require('./merge');

const joins = async (args, req) => {
  // if (!req.isAuth) {
  //   throw new Error('Unauthenticated');
  // }
  try {
    const joins = await Join.find();
    return joins.map((join) => {
      return transformJoin(join);
    });
  } catch (error) {
    throw error;
  }
};

const joinProject = async (args, req) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const fetchedProject = await Project.findById(args.projectId);
    fetchedProject.joinedUsers.push(req.userId);
    const join = new Join({
      user: req.userId,
      project: fetchedProject,
    });
    await fetchedProject.save();
    const result = await join.save();
    return transformJoin(result);
  } catch (error) {
    throw error;
  }
};

const cancelJoin = async (args, req) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const join = await Join.findById(args.joinId).populate('project');
    const project = await Project.findById(join.project.id);
    const removeUser = project.joinedUsers.find(
      (user) => user.toString() === req.userId
    );
    const index = project.joinedUsers.indexOf(removeUser);
    await project.joinedUsers.splice(index, 1);
    await project.save();
    await Join.findByIdAndRemove(args.joinId);
    return transformProject(project);
  } catch (error) {
    throw error;
  }
};

module.exports = { joins, joinProject, cancelJoin };
