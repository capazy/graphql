const { Schema, model } = require('mongoose');

const vacancySchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    title: { type: String, default: null },
    description: { type: String, default: null },
    experience: { type: String, default: null },
    skills: [{ type: String, default: null }],
    postulatedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    selectedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = model('Vacancy', vacancySchema);
