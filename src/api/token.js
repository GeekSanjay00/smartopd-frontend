import axiosInstance from './axios';

// Book a token for selected department
export const bookToken = async(departmentId) => {
    const response = await axiosInstance.post('/api/tokens/book', {
        departmentId,
    });
    return response.data;
};

// Get all my booked tokens
export const getMyTokens = async() => {
    const response = await axiosInstance.get('/api/tokens/my');
    return response.data;
};

// Cancel a waiting token
export const cancelToken = async(tokenId) => {
    const response = await axiosInstance.delete(
        `/api/tokens/cancel/${tokenId}`
    );
    return response.data;
};