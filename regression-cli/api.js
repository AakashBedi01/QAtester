import axios from 'axios';

// Fetch flows from the backend API
export const getFlows = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/flows'); // Adjust to your API URL
    return response.data;
  } catch (error) {
    console.error('Error fetching flows:', error);
    return [];
  }
};
