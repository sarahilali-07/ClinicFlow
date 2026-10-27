import jwt from 'jsonwebtoken';
import HttpError from '../config/HttpError.js';
import UserModel from '../models/UserModel.js';

class AuthMiddleware {
    static async verifyToken(req, res, next) {
        let token;

        try {
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
                token = req.headers.authorization.split(' ')[1];
            }

            if (!token) {
                throw new HttpError('Not authorized to access this route', 401);
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const currentUser = await UserModel.findById(decoded.id);

            if (!currentUser) {
                throw new HttpError('The user belonging to this token no longer exists', 401);
            }

            if (!currentUser.is_active) {
                throw new HttpError('Account is inactive or suspended', 403);
            }

            req.user = currentUser;
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return next(new HttpError('Invalid or expired token', 401));
            }
            next(error);
        }
    }
}

export default AuthMiddleware;
