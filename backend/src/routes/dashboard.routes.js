import express from 'express';
import DashboardController from '../controllers/DashboardController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.use(AuthMiddleware.verifyToken);

router.get('/stats', DashboardController.getStats);

export default router;
