const { Schema, model } = require('mongoose');

const joinSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    vacancy: {
      type: Schema.Types.ObjectId,
      ref: 'Vacancy',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = model('Join', joinSchema);
