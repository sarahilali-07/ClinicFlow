import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import ErrorMiddleware from './middleware/ErrorMiddleware.js';
import AuthRoutes from './routes/auth.routes.js';
import PatientRoutes from './routes/patient.routes.js';
import AppointmentRoutes from './routes/appointment.routes.js';
import DashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();

const app = express();

// Database connection
db.connect();

// Global Middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Route Mounts
app.use('/api/auth', AuthRoutes);
app.use('/api/patients', PatientRoutes);
app.use('/api/appointments', AppointmentRoutes);
app.use('/api/dashboard', DashboardRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'ClinicFlow Backend API is running',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Centralized Error Handling Middleware
app.use(ErrorMiddleware.handle);

// Graceful teardown
process.once('SIGINT', () => db.disconnect());

export default app;
