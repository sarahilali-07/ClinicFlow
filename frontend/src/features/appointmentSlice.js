import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as appointmentService from '../services/appointmentService';

export const fetchAppointments = createAsyncThunk(
    'appointments/fetchAll',
    async (filters, { rejectWithValue }) => {
        try {
            return await appointmentService.getAppointments(filters);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

export const bookAppointment = createAsyncThunk(
    'appointments/create',
    async (appointmentData, { rejectWithValue }) => {
        try {
            return await appointmentService.createAppointment(appointmentData);
        } catch (error) {
            // Extracts exact backend error (e.g., 409 conflict 30-min window)
            const message = error.response?.data?.message || error.message || 'Failed to book appointment';
            return rejectWithValue(message);
        }
    }
);

export const changeAppointmentStatus = createAsyncThunk(
    'appointments/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            return await appointmentService.updateAppointmentStatus(id, status);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

const appointmentSlice = createSlice({
    name: 'appointments',
    initialState: {
        appointments: [],
        isLoading: false,
        isError: false,
        errorMessage: '',
        actionSuccess: false
    },
    reducers: {
        clearAppointmentState: (state) => {
            state.isError = false;
            state.errorMessage = '';
            state.actionSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAppointments.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchAppointments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.appointments = action.payload;
            })
            .addCase(fetchAppointments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            // Book
            .addCase(bookAppointment.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.actionSuccess = false;
            })
            .addCase(bookAppointment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.actionSuccess = true;
                state.appointments.push(action.payload);
            })
            .addCase(bookAppointment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            // Status Update
            .addCase(changeAppointmentStatus.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.actionSuccess = false;
            })
            .addCase(changeAppointmentStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.actionSuccess = true;
                state.appointments = state.appointments.map((a) =>
                    a.id === action.payload.id ? { ...a, status: action.payload.status } : a
                );
            })
            .addCase(changeAppointmentStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            });
    }
});

export const { clearAppointmentState } = appointmentSlice.actions;
export default appointmentSlice.reducer;
