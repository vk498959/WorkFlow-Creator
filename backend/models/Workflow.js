const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  title: String,
  done: { type: Boolean, default: false }
});

const workflowSchema = new mongoose.Schema({
  name: String,
  steps: [stepSchema]
});

module.exports = mongoose.model('Workflow', workflowSchema);