import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as patientService from '../services/patientService';

export const fetchPatients = createAsyncThunk(
    'patients/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            return await patientService.getPatients(params);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

export const fetchPatientById = createAsyncThunk(
    'patients/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            return await patientService.getPatientById(id);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

export const createNewPatient = createAsyncThunk(
    'patients/create',
    async (patientData, { rejectWithValue }) => {
        try {
            return await patientService.createPatient(patientData);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

export const updateExistingPatient = createAsyncThunk(
    'patients/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await patientService.updatePatient(id, data);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

export const removePatient = createAsyncThunk(
    'patients/delete',
    async (id, { rejectWithValue }) => {
        try {
            await patientService.deletePatient(id);
            return id;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

const patientSlice = createSlice({
    name: 'patients',
    initialState: {
        patients: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1
        },
        selectedPatient: null,
        isLoading: false,
        isError: false,
        errorMessage: '',
        actionSuccess: false
    },
    reducers: {
        clearPatientState: (state) => {
            state.isError = false;
            state.errorMessage = '';
            state.actionSuccess = false;
        },
        clearSelectedPatient: (state) => {
            state.selectedPatient = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchPatients.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchPatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.patients = action.payload.patients;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            // Fetch By ID
            .addCase(fetchPatientById.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchPatientById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedPatient = action.payload;
            })
            .addCase(fetchPatientById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            // Create
            .addCase(createNewPatient.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.actionSuccess = false;
            })
            .addCase(createNewPatient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.actionSuccess = true;
                state.patients.unshift(action.payload);
                state.pagination.total += 1;
            })
            .addCase(createNewPatient.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            // Update
            .addCase(updateExistingPatient.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.actionSuccess = false;
            })
            .addCase(updateExistingPatient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.actionSuccess = true;
                state.patients = state.patients.map((p) =>
                    p.id === action.payload.id ? action.payload : p
                );
                if (state.selectedPatient && state.selectedPatient.id === action.payload.id) {
                    state.selectedPatient = { ...state.selectedPatient, ...action.payload };
                }
            })
            .addCase(updateExistingPatient.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            // Delete
            .addCase(removePatient.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(removePatient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.patients = state.patients.filter((p) => p.id !== action.payload);
                state.pagination.total -= 1;
                state.actionSuccess = true;
            })
            .addCase(removePatient.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            });
    }
});

export const { clearPatientState, clearSelectedPatient } = patientSlice.actions;
export default patientSlice.reducer;
