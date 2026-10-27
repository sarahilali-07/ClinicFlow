import api from './api';

export const getAppointments = async ({ date = '', status = '' } = {}) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (status && status !== 'all') params.append('status', status);

    const response = await api.get(`/api/appointments?${params.toString()}`);
    return response.data;
};

export const getAppointmentById = async (id) => {
    const response = await api.get(`/api/appointments/${id}`);
    return response.data;
};

export const createAppointment = async (appointmentData) => {
    const response = await api.post('/api/appointments', appointmentData);
    return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
    const response = await api.patch(`/api/appointments/${id}/status`, { status });
    return response.data;
};
