import api from './api';

// Function to get predictive analytics (e.g., patient readmission risk)
export const getPredictiveAnalytics = async (patientData) => {
  try {
    const response = await api.post('/ai/predict', patientData);
    return response.data;
  } catch (error) {
    console.error('Error fetching predictive analytics:', error);
    throw error;
  }
};

// Function to check symptoms using AI symptom checker
export const checkSymptoms = async (symptoms) => {
  try {
    const response = await api.post('/ai/symptom-checker', { symptoms });
    return response.data;
  } catch (error) {
    console.error('Error checking symptoms:', error);
    throw error;
  }
};

export default {
  getPredictiveAnalytics,
  checkSymptoms,
};