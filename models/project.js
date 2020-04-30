const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
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
});

module.exports = model('Project', projectSchema);
