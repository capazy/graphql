const { Schema, model } = require('mongoose');

const jobSchema = new Schema(
  {
    // job
    title: { type: String, default: null },
    description: { type: String, default: null },
    type: { type: String, default: null },
    expertise: { type: String, default: null },
    skills: [{ type: String, default: null }],
    salaryType: { type: String, default: null },
    salary: { type: String, default: null },
    files: [
      {
        name: { type: String, default: null },
        url: { type: String, default: null },
      },
    ],

    // company
    companyName: { type: String, default: null },
    companyDescription: { type: String, default: null },
    companyLocation: { type: String, default: null },
    companyLogo: { type: String, default: null },

    // general
    views: { type: Number, default: 0 },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = model('Job', jobSchema);
