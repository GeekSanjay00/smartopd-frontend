import axiosInstance from './axios';

// Get live queue status for a department
export const getQueueStatus = async(departmentId) => {
    const response = await axiosInstance.get(
        `/api/queue/${departmentId}`
    );
    return response.data;
};

// Get queue size for a department
export const getQueueSize = async(departmentId) => {
    const response = await axiosInstance.get(
        `/api/queue/${departmentId}/size`
    );
    return response.data;
};