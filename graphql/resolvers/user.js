const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const { projects, vacancies, joins } = require('./merge');

const user = async (args, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      password: null,
      joins: joins.bind(this, user.joins),
      createdProjects: projects.bind(this, user.createdProjects),
      joinedProjects: vacancies.bind(this, user.joinedProjects),
    };
  } catch (error) {
    throw error;
  }
};

const userById = async (args, { isAuth }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  const { userId } = args;
  try {
    const user = await User.findById(userId).sort({ createdAt: -1 });
    return {
      ...user._doc,
      password: null,
      createdProjects: projects.bind(this, user.createdProjects),
      joinedProjects: vacancies.bind(this, user.joinedProjects),
    };
  } catch (error) {
    throw error;
  }
};

const users = async ({ skill }) => {
  try {
    let users;
    if (skill) {
      users = await User.find({ skills: skill }).collation({
        locale: 'en',
        strength: 2,
      });
    } else {
      users = await Project.find();
    }
    return users;
  } catch (error) {
    throw new Error('Oops, something went wrong. Please try again later.');
  }
};

const createUser = async ({
  userInput: { email, password, firstName, lastName },
}) => {
  try {
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      throw new Error('User exists already.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    const token = await jwt.sign(
      { userId: user.id, email: user.email },
      'jwtsecretkey'
    );
    await user.save();
    return { userId: user.id, token, tokenExp: 24 };
  } catch (error) {
    throw error;
  }
};

const login = async ({ loginInput: { email, password } }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User does not exist.');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect.');
    }
    const token = await jwt.sign(
      { userId: user.id, email: user.email },
      'jwtsecretkey'
    );
    return { userId: user.id, token, tokenExp: 24 };
  } catch (error) {
    throw error;
  }
};

const updateUser = async ({ userInput }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { [userInput.method]: userInput },
      { new: true }
    );
    return user;
  } catch (error) {
    throw error;
  }
};

const createExperience = async ({ experienceInput }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const user = await User.findById(userId);
    user.workExperience.push(experienceInput);
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Oops, something went wrong. Please try again later.');
  }
};

const deleteExperience = async ({ experienceId }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const user = await User.findById(userId);
    const removeExperience = user.workExperience.find(
      (exp) => exp.id === experienceId
    );
    const index = user.workExperience.indexOf(removeExperience);
    await user.workExperience.splice(index, 1);
    const result = await user.save();

    return result;
  } catch (error) {
    throw new Error('Oops, something went wrong. Please try again later.');
  }
};

const createEducation = async ({ educationInput }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const user = await User.findById(userId);
    user.education.push(educationInput);
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Oops, something went wrong. Please try again later.');
  }
};

const deleteEducation = async ({ educationId }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const user = await User.findById(userId);
    const removeEducation = user.education.find(
      (edu) => edu.id === educationId
    );
    const index = user.workExperience.indexOf(removeEducation);
    await user.education.splice(index, 1);
    const result = await user.save();

    return result;
  } catch (error) {
    throw new Error('Oops, something went wrong. Please try again later.');
  }
};

const deleteUserFile = async ({ fileId }, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  const user = await User.findById(userId);
  const deleteFile = user.files.find((file) => file._id.toString() === fileId);
  const index = user.files.indexOf(deleteFile);
  await user.files.splice(index, 1);
  const result = await user.save();
  return result;
};

module.exports = {
  createUser,
  login,
  updateUser,
  user,
  users,
  userById,
  createExperience,
  deleteExperience,
  createEducation,
  deleteEducation,
  deleteUserFile,
};
