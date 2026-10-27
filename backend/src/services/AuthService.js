import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import HttpError from '../config/HttpError.js';
import { validateLogin, validateRegister } from '../validation/authValidate.js';

class AuthService {
    static #generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        });
    }

    static async login(email, password) {
        const validationError = validateLogin({ email, password });
        if (validationError) {
            throw new HttpError(validationError, 400);
        }

        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new HttpError('Invalid email or password', 401);
        }

        if (!user.is_active) {
            throw new HttpError('Account is inactive or suspended', 403);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new HttpError('Invalid email or password', 401);
        }

        const token = this.#generateToken(user);

        return {
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: user.role
            },
            token
        };
    }

    static async register(userData) {
        const validationError = validateRegister(userData);
        if (validationError) {
            throw new HttpError(validationError, 400);
        }

        const existingUser = await UserModel.findByEmail(userData.email);
        if (existingUser) {
            throw new HttpError('A user with this email already exists', 409);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await UserModel.create({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || 'staff'
        });

        const token = this.#generateToken(newUser);

        return {
            user: {
                id: newUser.id,
                firstName: newUser.first_name,
                lastName: newUser.last_name,
                email: newUser.email,
                role: newUser.role
            },
            token
        };
    }
}

export default AuthService;
