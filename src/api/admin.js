import axiosInstance from './axios';

// Get all users
export const getAllUsers = async() => {
    const response = await axiosInstance.get('/api/admin/users');
    return response.data;
};

// Get all departments
export const getAllDepartments = async() => {
    const response = await axiosInstance.get('/api/admin/departments');
    return response.data;
};

// Create new department
export const createDepartment = async(name, description) => {
    const response = await axiosInstance.post(
        `/api/admin/departments?name=${name}&description=${description}`
    );
    return response.data;
};

// Create new doctor account
export const createDoctor = async(
    name, specialization, departmentId, phone, password
) => {
    const response = await axiosInstance.post(
        `/api/admin/doctors?name=${name}&specialization=${specialization}&departmentId=${departmentId}&phone=${phone}&password=${password}`
    );
    return response.data;
};

// Deactivate user account
export const deactivateUser = async(userId) => {
    const response = await axiosInstance.patch(
        `/api/admin/users/${userId}/deactivate`
    );
    return response.data;
};

// Activate user account
export const activateUser = async(userId) => {
    const response = await axiosInstance.patch(
        `/api/admin/users/${userId}/activate`
    );
    return response.data;
};