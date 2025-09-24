import React, { useState, useEffect } from 'react';
import { createWorkflow, fetchWorkflow, fetchAllWorkflows, markStepDone, deleteWorkflow } from './api';
// (Make sure you've imported deleteWorkflow)
import './styles.css';



const WorkflowManager = () => {
  const [workflowId, setWorkflowId] = useState('');
  const [workflow, setWorkflow] = useState(null);
  const [allWorkflows, setAllWorkflows] = useState([]);
  const [name, setName] = useState('');
  const [stepsInput, setStepsInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all workflows on initial load
  useEffect(() => {
    const loadWorkflows = async () => {
      const workflows = await fetchAllWorkflows();
      setAllWorkflows(workflows);
    };
    loadWorkflows();
  }, []);

  // Fetch selected workflow
  useEffect(() => {
    if (workflowId) {
      fetchWorkflow(workflowId).then(setWorkflow);
    }
  }, [workflowId]);

  const handleCreate = async () => {
    const steps = stepsInput.split(',').map(title => ({ title: title.trim() }));
    const newWorkflow = await createWorkflow(name, steps);
    setWorkflowId(newWorkflow._id);
    setWorkflow(newWorkflow);
    setAllWorkflows(prev => [...prev, newWorkflow]);
    setName('');
    setStepsInput('');
  };

  const handleCheck = async (index) => {
    setLoading(true);
    const updated = await markStepDone(workflowId, index);
    setWorkflow(updated);
    setLoading(false);
  };

  const handleDeleteCompleted = () => {
    const filteredSteps = workflow.steps.filter(step => !step.done);
    const updatedWorkflow = { ...workflow, steps: filteredSteps };
    setWorkflow(updatedWorkflow);
  };
  const handleDeleteWorkflow = async (id) => {
    await deleteWorkflow(id);
    setAllWorkflows(prev => prev.filter(wf => wf._id !== id));
    if (workflowId === id) {
      setWorkflow(null);
      setWorkflowId('');
    }
  };

  return (
    <div className="container">
      <h1>🛠 Workflow Builder</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Workflow name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Steps (comma-separated)"
          value={stepsInput}
          onChange={e => setStepsInput(e.target.value)}
        />
        <button onClick={handleCreate}>Create Workflow</button>
      </div>

      <div className="workflow-list">
        <h2>📋 All Workflows</h2>
        <ul>
  {allWorkflows.map(wf => (
    <li key={wf._id}>
      <button onClick={() => setWorkflowId(wf._id)}>{wf.name}</button>
      <button onClick={() => handleDeleteWorkflow(wf._id)} className="delete-btn">🗑 Delete</button>
    </li>
  ))}
</ul>
      </div>

      {workflow && (
        <div className="workflow">
          <h2>{workflow.name}</h2>
          <ul>
            {workflow.steps.map((step, index) => (
              <li key={index} className={step.done ? 'done' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={step.done}
                    disabled={step.done || loading}
                    onChange={() => handleCheck(index)}
                  />
                  {step.title}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleDeleteCompleted}>Delete Completed Steps</button>
        </div>
      )}
    </div>
  );
};

export default WorkflowManager;
