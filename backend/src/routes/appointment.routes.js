import express from 'express';
import AppointmentController from '../controllers/AppointmentController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.use(AuthMiddleware.verifyToken);

router.post('/', AppointmentController.createAppointment);
router.get('/', AppointmentController.getAppointments);
router.get('/:id', AppointmentController.getAppointmentById);
router.patch('/:id/status', AppointmentController.updateStatus);

export default router;
