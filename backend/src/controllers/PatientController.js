import PatientService from '../services/PatientService.js';

class PatientController {
    static createPatient = async (req, res, next) => {
        try {
            const patient = await PatientService.createPatient(req.body);
            res.status(201).json(patient);
        } catch (error) {
            next(error);
        }
    };

    static getAllPatients = async (req, res, next) => {
        try {
            const { search, page, limit } = req.query;
            const result = await PatientService.getAllPatients({ search, page, limit });
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    static getPatientById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const patient = await PatientService.getPatientById(id);
            res.status(200).json(patient);
        } catch (error) {
            next(error);
        }
    };

    static updatePatient = async (req, res, next) => {
        try {
            const { id } = req.params;
            const updatedPatient = await PatientService.updatePatient(id, req.body);
            res.status(200).json(updatedPatient);
        } catch (error) {
            next(error);
        }
    };

    static deletePatient = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await PatientService.deletePatient(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}

export default PatientController;
