const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const { projects } = require('./merge');

const users = async () => {
  try {
    const users = await User.find();
    return users.map((user) => {
      return {
        ...user._doc,
        password: null,
        createdProjects: projects.bind(this, user.createdProjects),
      };
    });
  } catch (error) {
    throw error;
  }
};

const createUser = async (args) => {
  try {
    const existingUser = await User.findOne({ email: args.userInput.email });
    if (existingUser) {
      throw new Error('User exists already.');
    }
    const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    const user = new User({
      email: args.userInput.email,
      password: hashedPassword,
    });
    const result = await user.save();
    return { ...result._doc, password: null };
  } catch (error) {
    throw error;
  }
};

const login = async ({ email, password }) => {
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

module.exports = { users, createUser, login };
