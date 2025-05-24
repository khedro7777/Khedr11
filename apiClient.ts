import axios from 'axios';

// Define the base URL for the backend API
// In development, this might be localhost. In production, it will be the deployed backend URL.
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'YOUR_PRODUCTION_BACKEND_URL' // Replace with actual production URL later
    : 'http://localhost:5000/api'; // Assuming backend runs on port 5000 locally

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in headers
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from wherever it's stored (e.g., Zustand store via localStorage)
    // This requires accessing the Zustand store state outside of a React component,
    // which can be done using store.getState()
    const { useAuth } = require('@/hooks/use-auth'); // Use require to avoid circular dependency issues if any
    const token = useAuth.getState().token; // Assuming token is stored in auth state

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for handling common errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login or refresh token
      console.error('Unauthorized access - 401');
      // Example: Logout user
      const { useAuth } = require('@/hooks/use-auth');
      useAuth.getState().logout();
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

