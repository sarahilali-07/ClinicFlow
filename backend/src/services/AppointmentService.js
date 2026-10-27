import AppointmentModel from '../models/AppointmentModel.js';
import PatientModel from '../models/PatientModel.js';
import HttpError from '../config/HttpError.js';
import { validateCreateAppointment, validateUpdateStatus } from '../validation/appointmentValidate.js';

class AppointmentService {
    static async createAppointment(appointmentData, userId) {
        const validationError = validateCreateAppointment(appointmentData);
        if (validationError) {
            throw new HttpError(validationError, 400);
        }

        const patient = await PatientModel.findById(appointmentData.patientId);
        if (!patient) {
            throw new HttpError('Patient not found', 404);
        }

        // Business rule: A patient cannot have 2 confirmed appointments within a 30-minute window
        if (appointmentData.status === 'confirmed') {
            const conflict = await AppointmentModel.findConflictingAppointment(
                appointmentData.patientId,
                appointmentData.appointmentDate
            );

            if (conflict) {
                throw new HttpError(
                    'A patient cannot have 2 confirmed appointments within a 30-minute window',
                    409
                );
            }
        }

        const newAppointment = await AppointmentModel.create({
            ...appointmentData,
            createdBy: userId
        });

        return newAppointment;
    }

    static async getAppointments(filters = {}) {
        return await AppointmentModel.findAll(filters);
    }

    static async getAppointmentById(id) {
        const appointment = await AppointmentModel.findById(id);
        if (!appointment) {
            throw new HttpError('Appointment not found', 404);
        }
        return appointment;
    }

    static async updateStatus(id, statusData) {
        const validationError = validateUpdateStatus(statusData);
        if (validationError) {
            throw new HttpError(validationError, 400);
        }

        const existingAppointment = await AppointmentModel.findById(id);
        if (!existingAppointment) {
            throw new HttpError('Appointment not found', 404);
        }

        // Business rule check when confirming an appointment
        if (statusData.status === 'confirmed') {
            const conflict = await AppointmentModel.findConflictingAppointment(
                existingAppointment.patientId,
                existingAppointment.appointmentDate,
                id
            );

            if (conflict) {
                throw new HttpError(
                    'A patient cannot have 2 confirmed appointments within a 30-minute window',
                    409
                );
            }
        }

        return await AppointmentModel.updateStatus(id, statusData.status);
    }
}

export default AppointmentService;
