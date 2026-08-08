import axiosInstance from './axios';

// Get all doctors
export const getAllDoctors = async() => {
    const response = await axiosInstance.get('/api/doctors');
    return response.data;
};

// Get doctor by id
export const getDoctorById = async(id) => {
    const response = await axiosInstance.get(`/api/doctors/${id}`);
    return response.data;
};

// Get doctors by department
export const getDoctorsByDepartment = async(departmentId) => {
    const response = await axiosInstance.get(
        `/api/doctors/department/${departmentId}`
    );
    return response.data;
};

// Toggle doctor availability
export const toggleAvailability = async(id) => {
    const response = await axiosInstance.patch(
        `/api/doctors/${id}/availability`
    );
    return response.data;
};

// Call next patient
export const callNextPatient = async(id) => {
    const response = await axiosInstance.post(
        `/api/doctors/${id}/next`
    );
    return response.data;
};

// Mark token as done
export const markTokenDone = async(id, tokenNumber) => {
    const response = await axiosInstance.post(
        `/api/doctors/${id}/done/${tokenNumber}`
    );
    return response.data;
};

// Skip patient
export const skipPatient = async(id, tokenNumber) => {
    const response = await axiosInstance.post(
        `/api/doctors/${id}/skip/${tokenNumber}`
    );
    return response.data;
};