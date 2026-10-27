import Joi from 'joi';

const patientSchema = Joi.object({
    fullName: Joi.string().trim().min(3).max(150).required().messages({
        'string.empty': 'Full name is required',
        'any.required': 'Full name is required'
    }),
    cin: Joi.string().trim().uppercase().min(3).max(50).required().messages({
        'string.empty': 'CIN is required',
        'any.required': 'CIN is required'
    }),
    phone: Joi.string().trim().min(6).max(50).required().messages({
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required'
    }),
    birthDate: Joi.date().iso().max('now').required().messages({
        'date.format': 'Birth date must be a valid date (YYYY-MM-DD)',
        'date.max': 'Birth date cannot be in the future',
        'any.required': 'Birth date is required'
    }),
    address: Joi.string().trim().allow('', null)
});

const updatePatientSchema = Joi.object({
    fullName: Joi.string().trim().min(3).max(150),
    cin: Joi.string().trim().uppercase().min(3).max(50),
    phone: Joi.string().trim().min(6).max(50),
    birthDate: Joi.date().iso().max('now'),
    address: Joi.string().trim().allow('', null)
}).min(1);

const validate = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        return error.details[0].message;
    }
    return null;
};

export const validateCreatePatient = (data) => validate(patientSchema, data);
export const validateUpdatePatient = (data) => validate(updatePatientSchema, data);
