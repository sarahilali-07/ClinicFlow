import AppointmentService from '../services/AppointmentService.js';

class AppointmentController {
    static createAppointment = async (req, res, next) => {
        try {
            const appointment = await AppointmentService.createAppointment(req.body, req.user.id);
            res.status(201).json(appointment);
        } catch (error) {
            next(error);
        }
    };

    static getAppointments = async (req, res, next) => {
        try {
            const { date, status } = req.query;
            const appointments = await AppointmentService.getAppointments({ date, status });
            res.status(200).json(appointments);
        } catch (error) {
            next(error);
        }
    };

    static getAppointmentById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const appointment = await AppointmentService.getAppointmentById(id);
            res.status(200).json(appointment);
        } catch (error) {
            next(error);
        }
    };

    static updateStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await AppointmentService.updateStatus(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}

export default AppointmentController;
