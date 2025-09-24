const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Workflow = require('./models/Workflow');
const cors = require('cors');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Create a new workflow
app.post('/workflow', async (req, res) => {
  const { name, steps } = req.body;
  const workflow = new Workflow({ name, steps });
  await workflow.save();
  res.status(201).json(workflow);
});

// Get workflow by ID
app.get('/workflow/:id', async (req, res) => {
  const workflow = await Workflow.findById(req.params.id);
  res.json(workflow);
});
app.get('/workflow', async (req, res) => {
    const workflows = await Workflow.find(); // Assuming you're using Mongoose
    res.json(workflows);
  });
// Mark a step as done
app.put('/workflow/:workflowId/step/:stepIndex', async (req, res) => {
  const { workflowId, stepIndex } = req.params;
  const workflow = await Workflow.findById(workflowId);
  if (!workflow || !workflow.steps[stepIndex]) {
    return res.status(404).json({ error: 'Step not found' });
  }
  workflow.steps[stepIndex].done = true;
  await workflow.save();
  res.json(workflow);
});
app.delete('/workflow/:id', async (req, res) => {
    await Workflow.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });
// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});