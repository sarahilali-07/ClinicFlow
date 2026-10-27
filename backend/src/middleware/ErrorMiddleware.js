import HttpError from '../config/HttpError.js';

class ErrorMiddleware {
    static handle(err, req, res, next) {
        if (err instanceof HttpError) {
            return res.status(err.statusCode).json({ message: err.message });
        }

        console.error('Unhandled server error:', err);
        return res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
}

export default ErrorMiddleware;
