import AuthService from '../services/AuthService.js';

class AuthController {
    static login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    static me = async (req, res, next) => {
        try {
            res.status(200).json({ user: req.user });
        } catch (error) {
            next(error);
        }
    };

    static register = async (req, res, next) => {
        try {
            const result = await AuthService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };
}

export default AuthController;
