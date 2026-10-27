import api from './api';

export const getPatients = async ({ search = '', page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const response = await api.get(`/api/patients?${params.toString()}`);
    return response.data;
};

export const getPatientById = async (id) => {
    const response = await api.get(`/api/patients/${id}`);
    return response.data;
};

export const createPatient = async (patientData) => {
    const response = await api.post('/api/patients', patientData);
    return response.data;
};

export const updatePatient = async (id, patientData) => {
    const response = await api.put(`/api/patients/${id}`, patientData);
    return response.data;
};

export const deletePatient = async (id) => {
    const response = await api.delete(`/api/patients/${id}`);
    return response.data;
};
