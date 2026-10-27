import express from 'express';
import PatientController from '../controllers/PatientController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import RoleMiddleware from '../middleware/RoleMiddleware.js';

const router = express.Router();

router.use(AuthMiddleware.verifyToken);

router.post('/', PatientController.createPatient);
router.get('/', PatientController.getAllPatients);
router.get('/:id', PatientController.getPatientById);
router.put('/:id', PatientController.updatePatient);
router.delete('/:id', RoleMiddleware.isAdmin, PatientController.deletePatient);

export default router;
