const { Schema, model } = require('mongoose');

const projectSchema = new Schema(
  {
    title: { type: String, default: null },
    description: { type: String, default: null },
    type: { type: String, default: null },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    published: { type: String, default: null },
    isOpen: { type: Boolean, default: false },
    skills: [{ type: String, default: null }],
    projectPictureName: { type: String, default: null },
    projectPictureUrl: { type: String, default: null },
    views: { type: Number, default: 0 },
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
    files: [
      {
        name: { type: String, default: null },
        url: { type: String, default: null },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model('Project', projectSchema);
