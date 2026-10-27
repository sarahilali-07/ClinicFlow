import Joi from 'joi';

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    })
});

const registerSchema = Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'First name is required',
        'any.required': 'First name is required'
    }),
    lastName: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'Last name is required',
        'any.required': 'Last name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    }),
    role: Joi.string().valid('admin', 'staff').default('staff')
});

const validate = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        return error.details[0].message;
    }
    return null;
};

export const validateLogin = (data) => validate(loginSchema, data);
export const validateRegister = (data) => validate(registerSchema, data);
