import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const getFlows = async () => {
  try {
    const response = await axios.get(`${API_URL}/flows`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flows:', error.message);
    throw error;
  }
};

export const createFlow = async (flowData) => {
  try {
    const response = await axios.post(`${API_URL}/flows`, flowData);
    return response.data;
  } catch (error) {
    console.error('Error creating flow:', error.message);
    throw error;
  }
};

export const runFlow = async (flowName) => {
  try {
    const response = await axios.post(`${API_URL}/run-flow`, { flowName });
    return response.data;
  } catch (error) {
    console.error('Error running flow:', error.message);
    throw error;
  }
};

export const getTestReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/test-report`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test report:', error.message);
    throw error;
  }
};
