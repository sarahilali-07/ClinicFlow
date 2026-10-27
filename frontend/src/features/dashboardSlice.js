import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as dashboardService from '../services/dashboardService';

export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            return await dashboardService.getStats();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        stats: {
            totalPatients: 0,
            todayAppointments: 0,
            pendingAppointments: 0,
            confirmedAppointments: 0,
            cancelledAppointments: 0
        },
        isLoading: false,
        isError: false,
        errorMessage: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            });
    }
});

export default dashboardSlice.reducer;
