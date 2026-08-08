// Save login data to localStorage after successful login
export const saveAuthData = (token, role, name, phone) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    localStorage.setItem('phone', phone);
};

// Get JWT token from localStorage
export const getToken = () => localStorage.getItem('token');

// Get user role from localStorage
export const getRole = () => localStorage.getItem('role');

// Get user name from localStorage
export const getName = () => localStorage.getItem('name');

// Get user phone from localStorage
export const getPhone = () => localStorage.getItem('phone');

// Check if user is logged in
export const isLoggedIn = () => !!localStorage.getItem('token');

// Clear all auth data on logout
export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('phone');
};

// Format date to readable Indian format
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN');
};

// Get department name by ID
export const getDepartmentName = (id) => {
    const departments = {
        1: 'General',
        2: 'Eye',
        3: 'Surgery',
        4: 'Ortho',
    };
    return departments[id] || 'Unknown';
};