const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdProjects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],
});

module.exports = model('User', userSchema);
