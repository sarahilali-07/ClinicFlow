import PatientModel from '../models/PatientModel.js';
import HttpError from '../config/HttpError.js';
import { validateCreatePatient, validateUpdatePatient } from '../validation/patientValidate.js';

class PatientService {
    static async createPatient(data) {
        const validationError = validateCreatePatient(data);
        if (validationError) {
            throw new HttpError(validationError, 400);
        }

        const existingPatient = await PatientModel.findByCin(data.cin);
        if (existingPatient) {
            throw new HttpError(`A patient with CIN '${data.cin.toUpperCase()}' already exists`, 409);
        }

        return await PatientModel.create(data);
    }

    static async getAllPatients(filters = {}) {
        return await PatientModel.findAll(filters);
    }

    static async getPatientById(id) {
        const patient = await PatientModel.findByIdWithAppointments(id);
        if (!patient) {
            throw new HttpError('Patient not found', 404);
        }
        return patient;
    }

    static async updatePatient(id, data) {
        const validationError = validateUpdatePatient(data);
        if (validationError) {
            throw new HttpError(validationError, 400);
        }

        const existingPatient = await PatientModel.findById(id);
        if (!existingPatient) {
            throw new HttpError('Patient not found', 404);
        }

        if (data.cin && data.cin.toUpperCase() !== existingPatient.cin) {
            const cinConflict = await PatientModel.findByCin(data.cin);
            if (cinConflict && cinConflict.id !== id) {
                throw new HttpError(`Another patient with CIN '${data.cin.toUpperCase()}' already exists`, 409);
            }
        }

        const updated = await PatientModel.update(id, data);
        if (!updated) {
            throw new HttpError('Patient not found', 404);
        }
        return updated;
    }

    static async deletePatient(id) {
        const success = await PatientModel.softDelete(id);
        if (!success) {
            throw new HttpError('Patient not found', 404);
        }
        return { message: 'Patient deleted successfully' };
    }
}

export default PatientService;
