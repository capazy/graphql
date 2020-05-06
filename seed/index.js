const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Project = require('../models/project');
const Vacancy = require('../models/vacancy');
const Join = require('../models/join');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/capazy', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('DB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect('mongodb://127.0.0.1:27017/capazy');
    console.log('DB Disconnected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash('123456', 12);

  const users = [
    new User({
      email: 'sebas@capazy.com',
      password: hashedPassword,
      firstName: 'Sebas',
      lastName: 'Hdez',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt veritatis doloremque facilis iusto animi quam dolorum quibusdam vero aperiam ad. Delectus rerum aliquid omnis laborum saepe odio voluptatum nobis nemo!',
      skills: ['react', 'javascript'],
      languages: ['english', 'spanish'],
      experience: 'beginner',
      companyName: 'Test Name',
      companyDepartment: 'test Department',
      country: 'cabada',
    }),
    new User({
      email: 'julian@capazy.com',
      password: hashedPassword,
      firstName: 'Julian',
      lastName: 'Urrego',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt veritatis doloremque facilis iusto animi quam dolorum quibusdam vero aperiam ad. Delectus rerum aliquid omnis laborum saepe odio voluptatum nobis nemo!',
      skills: ['react', 'javascript'],
      languages: ['english', 'spanish'],
      experience: 'beginner',
      companyName: 'Test Name',
      companyDepartment: 'test Department',
      country: 'cabada',
    }),
    new User({
      email: 'danilo@capazy.com',
      password: hashedPassword,
      firstName: 'Danilo',
      lastName: 'Caicedo',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt veritatis doloremque facilis iusto animi quam dolorum quibusdam vero aperiam ad. Delectus rerum aliquid omnis laborum saepe odio voluptatum nobis nemo!',
      skills: ['react', 'javascript'],
      languages: ['english', 'spanish'],
      experience: 'beginner',
      companyName: 'Test Name',
      companyDepartment: 'test Department',
      country: 'cabada',
    }),
  ];

  let done = 0;
  await users.forEach(async (user) => {
    user.save(() => {
      done++;
      if (done === users.length) {
        console.log('Seed Created');
        disconnectDB();
      }
    });
  });
};

runSeed();
