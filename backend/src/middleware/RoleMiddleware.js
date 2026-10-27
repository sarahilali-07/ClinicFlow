import HttpError from '../config/HttpError.js';

class RoleMiddleware {
    static isAdmin(req, res, next) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                throw new HttpError('Admin access required for this action', 403);
            }
            next();
        } catch (error) {
            next(error);
        }
    }

    static isStaffOrAdmin(req, res, next) {
        try {
            if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'staff')) {
                throw new HttpError('Authorized staff or admin access required', 403);
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default RoleMiddleware;
