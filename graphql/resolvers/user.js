const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const { projects, vacancies } = require('./merge');

const user = async (args, { isAuth, userId }) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  try {
    const user = await User.findById(userId);
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
    throw error;
  }
};

const createUser = async ({
  userInput: { email, password, firstName, lastName },
}) => {
  try {
    const existingUser = await User.findOne({ email });
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
      'jwtsecretkey',
      {
        expiresIn: '1h',
      }
    );
    await user.save();
    return { userId: user.id, token, tokenExp: 1 };
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
      'jwtsecretkey',
      {
        expiresIn: '1h',
      }
    );
    return { userId: user.id, token, tokenExp: 1 };
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
      {
        $set: userInput,
      },
      { new: true }
    );
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser, login, updateUser, user, users };
