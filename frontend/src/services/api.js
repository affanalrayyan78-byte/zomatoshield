import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const registerUser = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Policy APIs
export const calculatePremium = async (userId, city) => {
  const response = await api.post('/policies/calculate-premium', { userId, city });
  return response.data;
};

export const buyPolicy = async (policyData) => {
  const response = await api.post('/policies/buy', policyData);
  return response.data;
};

export const getUserPolicies = async (userId) => {
  const response = await api.get(`/policies/user/${userId}`);
  return response.data;
};

// Claim APIs
export const triggerClaim = async (userId, disruptionType) => {
  const response = await api.post('/claims/trigger', { userId, disruptionType });
  return response.data;
};

export const getUserClaims = async (userId) => {
  const response = await api.get(`/claims/user/${userId}`);
  return response.data;
};

export default api;