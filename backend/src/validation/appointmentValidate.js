import Joi from 'joi';

const createAppointmentSchema = Joi.object({
    patientId: Joi.string().uuid().required().messages({
        'string.guid': 'Patient ID must be a valid UUID',
        'string.empty': 'Patient ID is required',
        'any.required': 'Patient ID is required'
    }),
    appointmentDate: Joi.date().iso().required().messages({
        'date.format': 'Appointment date must be a valid ISO date-time',
        'any.required': 'Appointment date is required'
    }),
    status: Joi.string().valid('pending', 'confirmed', 'cancelled').default('pending'),
    reason: Joi.string().trim().min(3).required().messages({
        'string.empty': 'Reason is required',
        'any.required': 'Reason is required'
    }),
    notes: Joi.string().trim().allow('', null)
});

const updateStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'cancelled').required().messages({
        'any.only': "Status must be one of: 'pending', 'confirmed', 'cancelled'",
        'any.required': 'Status is required'
    })
});

const validate = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        return error.details[0].message;
    }
    return null;
};

export const validateCreateAppointment = (data) => validate(createAppointmentSchema, data);
export const validateUpdateStatus = (data) => validate(updateStatusSchema, data);
