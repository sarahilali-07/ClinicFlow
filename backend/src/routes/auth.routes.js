import express from 'express';
import AuthController from '../controllers/AuthController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/login', AuthController.login);
router.get('/me', AuthMiddleware.verifyToken, AuthController.me);
router.post('/register', AuthController.register);

export default router;
