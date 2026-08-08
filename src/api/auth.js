import axiosInstance from './axios';

// Register new patient
export const registerUser = async(name, phone, password, email) => {
    const response = await axiosInstance.post('/auth/register', {
        name,
        phone,
        password,
        email,
    });
    return response.data;
};

// Login user - returns JWT token
export const loginUser = async(phone, password) => {
    const response = await axiosInstance.post('/auth/login', {
        phone,
        password,
    });
    return response.data;
};

// Send OTP to phone number
export const sendOtp = async(phone) => {
    const response = await axiosInstance.post(
        `/auth/send-otp?phone=${phone}`
    );
    return response.data;
};

// Verify OTP
export const verifyOtp = async(phone, otp) => {
    const response = await axiosInstance.post('/auth/verify-otp', {
        phone,
        otp,
    });
    return response.data;
};