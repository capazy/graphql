const Job = require('../../models/job');
const User = require('../../models/user');
const { transformJob } = require('./merge');

const createJob = async (
  {
    jobInput: {
      title,
      //   description,
      //   type,
      //   expertise,
      //   skills,
      //   salaryType,
      //   salary,
      //   files,
      //   companyName,
      //   companyDescription,
      //   companyLocation,
      //   companyLogo,
    },
  },
  { isAuth, userId }
) => {
  if (!isAuth) {
    throw new Error('Unauthenticated');
  }
  const job = new Job({
    title,
    creator: userId,
  });
  try {
    const user = await User.findById(userId);
    user.createdJobs.unshift(job);
    user.save();
    const result = await job.save();
    return transformJob(result);
  } catch (error) {
    throw new Error('Oops, something went wrong. Please try again later.');
  }
};

module.exports = { createJob };
