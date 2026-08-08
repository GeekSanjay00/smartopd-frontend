import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { clearAuthData } from '../utils/helpers';

// Create axios instance with backend base URL
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically add JWT token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Token expired → logout automatically
        if (error.response && error.response.status === 401) {
            clearAuthData();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;