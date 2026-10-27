import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../services/authService';

const getAuthErrorMessage = (error) => {
    if (!error.response) {
        const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        return `No response from ClinicFlow API at ${apiUrl}. Check that the backend is running and that CORS allows this frontend origin.`;
    }

    return error.response.data?.message || `Request failed with HTTP ${error.response.status}.`;
};

let storedUser = null;
try {
    const raw = localStorage.getItem('user');
    if (raw) storedUser = JSON.parse(raw);
} catch {
    storedUser = null;
}

const storedToken = localStorage.getItem('token');

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            return await authService.login(credentials);
        } catch (error) {
            return rejectWithValue(getAuthErrorMessage(error));
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'auth/me',
    async (_, { rejectWithValue }) => {
        try {
            return await authService.getMe();
        } catch (error) {
            return rejectWithValue(getAuthErrorMessage(error));
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: storedUser,
        token: storedToken,
        isLoading: false,
        isError: false,
        errorMessage: ''
    },
    reducers: {
        logoutUser: (state) => {
            authService.logout();
            state.user = null;
            state.token = null;
            state.isLoading = false;
            state.isError = false;
            state.errorMessage = '';
        },
        clearAuthError: (state) => {
            state.isError = false;
            state.errorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = '';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isError = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            // Fetch Current User
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.user = null;
                state.token = null;
            });
    }
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
