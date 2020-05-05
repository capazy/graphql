const { Schema, model } = require('mongoose');

const projectSchema = new Schema(
  {
    title: { type: String, default: null },
    description: { type: String, default: null },
    skills: [{ type: String, default: null }],
    type: { type: String, default: null },
    deadline: { type: Date, default: null },
    published: { type: String, default: null },
    isOpen: { type: Boolean, default: true },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    vacancies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Vacancy',
      },
    ],
  },
  { timestamps: true }
);

module.exports = model('Project', projectSchema);
