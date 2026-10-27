import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import patientReducer from '../features/patientSlice';
import appointmentReducer from '../features/appointmentSlice';
import dashboardReducer from '../features/dashboardSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        patients: patientReducer,
        appointments: appointmentReducer,
        dashboard: dashboardReducer
    }
});

export default store;
