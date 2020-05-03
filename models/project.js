const { Schema, model } = require('mongoose');

const projectSchema = new Schema(
  {
    title: { type: String, default: null },
    description: { type: String, default: null },
    skills: [{ type: String, default: null }],
    type: { type: String, default: null },
    spots: { type: Number, default: null },
    published: { type: String, default: null },
    isOpen: { type: Boolean, default: false },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    joinedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = model('Project', projectSchema);
