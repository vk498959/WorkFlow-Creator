import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const createWorkflow = async (name, steps) => {
  const res = await axios.post(`${API_BASE}/workflow`, { name, steps });
  return res.data;
};

export const fetchWorkflow = async (id) => {
  const res = await axios.get(`${API_BASE}/workflow/${id}`);
  return res.data;
};

export const markStepDone = async (workflowId, stepIndex) => {
  const res = await axios.put(`${API_BASE}/workflow/${workflowId}/step/${stepIndex}`);
  return res.data;
};

// ✅ Add this function to fetch all workflows
export const fetchAllWorkflows = async () => {
  const res = await axios.get(`${API_BASE}/workflow`);
  return res.data;
};
export const deleteWorkflow = async (id) => {
  const res = await axios.delete(`${API_BASE}/workflow/${id}`);
  return res.data;
};
