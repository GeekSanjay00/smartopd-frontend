import axiosInstance from './axios';

// Get overall hospital stats
export const getOverallStats = async() => {
    const response = await axiosInstance.get('/api/analytics/stats');
    return response.data;
};

// Get avg wait time by department
export const getAvgWaitTime = async() => {
    const response = await axiosInstance.get(
        '/api/analytics/wait-time'
    );
    return response.data;
};

// Get today tokens by department
export const getTodayTokens = async() => {
    const response = await axiosInstance.get(
        '/api/analytics/tokens-today'
    );
    return response.data;
};

// Get peak hours data
export const getPeakHours = async() => {
    const response = await axiosInstance.get(
        '/api/analytics/peak-hours'
    );
    return response.data;
};