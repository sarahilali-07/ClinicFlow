import api from './api';

export const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
