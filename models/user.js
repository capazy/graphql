const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    methodId: { type: String, default: null },
    email: { type: String, required: true },
    password: { type: String },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    description: { type: String, default: null },
    expertise: { type: String, default: null },
    skills: [{ type: String, default: null }],
    additionalSkills: [{ type: String, default: null }],
    languages: [{ type: String, default: null }],
    experience: { type: String, default: null },
    companyName: { type: String, default: null },
    companyDepartment: { type: String, default: null },
    country: { type: String, default: null },
    isAvailable: { type: Boolean, default: true },
    profilePictureName: { type: String, default: null },
    profilePictureUrl: { type: String, default: null },
    role: { type: String, default: 'user' },
    files: [
      {
        name: { type: String, default: null },
        url: { type: String, default: null },
      },
    ],

    workExperience: [
      {
        title: { type: String, default: null },
        companyName: { type: String, default: null },
        yearsOfExperience: { type: String, default: null },
        description: { type: String, default: null },
        skills: [{ type: String, default: null }],
      },
    ],

    education: [
      {
        degree: { type: String, default: null },
        school: { type: String, default: null },
        year: { type: String, default: null },
        fieldOfStudy: { type: String, default: null },
      },
    ],

    createdProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    joinedProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Vacancy',
      },
    ],
    joins: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Join',
      },
    ],
    createdJobs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
