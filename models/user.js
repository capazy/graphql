const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  description: { type: String, default: null },
  skills: [{ type: String, default: null }],
  languages: [{ type: String, default: null }],
  experience: { type: String, default: null },
  companyName: { type: String, default: null },
  companyDepartment: { type: String, default: null },
  country: { type: String, default: null },
  isAvailable: { type: Boolean, default: true },
  createdProjects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],
});

module.exports = model('User', userSchema);
