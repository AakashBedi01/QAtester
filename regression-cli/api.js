import axios from 'axios';

// Base API URL (can be moved to an environment variable for flexibility)
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// Fetch flows from the backend API
export const getFlows = async () => {
  try {
    const response = await axios.get(`${API_URL}/flows`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flows:', error.message);
    return [];
  }
};
