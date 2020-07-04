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
    throw new Error('Oops, something went wrong. Please try again later.');
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
    throw new Error('Oops, something went wrong. Please try again later.');
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
        expiresIn: '24h',
      }
    );
    await user.save();
    return { userId: user.id, token, tokenExp: 24 };
  } catch (error) {
    throw new Error('Oops, something went wrong. Please try again later.');
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
      // {
      //   expiresIn: '24h',
      // }
    );
    return { userId: user.id, token, tokenExp: 24 };
  } catch (error) {
    throw error;
  }
};

const passportSign = async ({ token }, { user }) => {
  try {
    console.log('TOKEN', token);
    console.log('USER', user);
    return { token };
  } catch (error) {
    throw new Error('Oops, something went wrong. Please try again later.');
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
    throw new Error('Oops, something went wrong. Please try again later.');
  }
};

const google = async (req, res, next) => {
  try {
    const {
      id: methodId,
      name: { givenName: firstName, familyName: lastName },
      emails,
      photos,
    } = req.user.profile;
    const email = emails[0].value;
    const profilePictureUrl = photos[0].value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        message: 'User already exists',
      });
    }
    const user = new User({
      firstName,
      lastName,
      email,
      profilePictureUrl,
    });
    const token = await jwt.sign(
      { userId: user.id, email: user.email },
      'jwtsecretkey',
      {
        expiresIn: '24h',
      }
    );
    await user.save();
    // res.redirect('http://localhost:3000/feed');
    // return res.status(200).json({ userId: user.id, token, tokenExp: 24 });
    req.userId = user.id;
    req.token = token;
    req.tokenExp = 24;

    return res.redirect('http://localhost:3000/feed');
  } catch (error) {
    return res.status(500).json({
      message: 'Server Error',
    });
  }
};

const fetchUser = async (req, res) => {
  const { userId, token, tokenExp } = req;
  const result = { userId, token, tokenExp };
  console.log('result', result);
  res.send(result);
};

module.exports = {
  createUser,
  login,
  updateUser,
  user,
  users,
  userById,
  passportSign,
  google,
  fetchUser,
};
