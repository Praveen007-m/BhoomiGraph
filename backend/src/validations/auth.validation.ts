import Joi from 'joi';

/**
 * Authentication Validation Schemas
 * 
 * Defines Joi schemas for all authentication endpoints.
 */

// Common validation rules
const email = Joi.string()
  .email()
  .max(255)
  .trim()
  .lowercase()
  .messages({
    'string.email': 'Please provide a valid email address',
    'string.max': 'Email cannot exceed 255 characters',
    'string.empty': 'Email is required'
  });

const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password cannot exceed 128 characters',
    'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character'
  });

const mobile = Joi.string()
  .pattern(/^[6-9]\d{9}$/)
  .messages({
    'string.pattern.base': 'Please provide a valid 10-digit mobile number'
  });

const name = Joi.string()
  .min(2)
  .max(100)
  .trim()
  .pattern(/^[a-zA-Z\s'-]+$/)
  .messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 100 characters',
    'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes'
  });

const role = Joi.string()
  .valid('farmer', 'pilot', 'agronomist', 'admin')
  .messages({
    'any.only': 'Invalid role specified'
  });

const otp = Joi.string()
  .length(4)
  .pattern(/^\d+$/)
  .messages({
    'string.length': 'OTP must be 4 digits',
    'string.pattern.base': 'OTP must contain only numbers'
  });

const uuid = Joi.string()
  .uuid()
  .messages({
    'string.guid': 'Invalid ID format'
  });

// ================= REGISTER SCHEMA =================
export const registerSchema = Joi.object({
  body: Joi.object({
    name: name.required(),
    email: email.required(),
    password: password.required(),
    mobile: mobile,
    role: role.default('farmer')
  }).unknown(false)
});

// ================= LOGIN SCHEMA =================
export const loginSchema = Joi.object({
  body: Joi.object({
    email: email.when('$withMobile', {
      is: true,
      then: email.forbidden(),
      otherwise: email.required()
    }),
    mobile: mobile.when('$withEmail', {
      is: true,
      then: mobile.forbidden(),
      otherwise: mobile
    }),
    password: password.required()
  }).or('email', 'mobile')
    .with('email', 'password')
    .with('mobile', 'password')
});

// ================= OTP SCHEMAS =================
export const sendOtpSchema = Joi.object({
  body: Joi.object({
    mobile: mobile.required()
  })
});

export const verifyOtpSchema = Joi.object({
  body: Joi.object({
    mobile: mobile.required(),
    otp: otp.required()
  })
});

// ================= REFRESH TOKEN SCHEMA =================
export const refreshTokenSchema = Joi.object({
  body: Joi.object({
    refreshToken: Joi.string()
      .required()
      .min(20)
      .messages({
        'string.empty': 'Refresh token is required',
        'string.min': 'Invalid refresh token'
      })
  })
});

// ================= CHANGE PASSWORD SCHEMA =================
export const changePasswordSchema = Joi.object({
  body: Joi.object({
    currentPassword: password.required(),
    newPassword: password.required().disallow(Joi.ref('currentPassword'))
      .messages({
        'any.invalid': 'New password must be different from current password'
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Passwords do not match'
      })
  })
});

// ================= FORGOT PASSWORD SCHEMA =================
export const forgotPasswordSchema = Joi.object({
  body: Joi.object({
    email: email.required()
  })
});

// ================= RESET PASSWORD SCHEMA =================
export const resetPasswordSchema = Joi.object({
  body: Joi.object({
    token: Joi.string()
      .required()
      .min(20)
      .messages({
        'string.empty': 'Reset token is required',
        'string.min': 'Invalid reset token'
      }),
    newPassword: password.required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Passwords do not match'
      })
  })
});

// ================= UPDATE PROFILE SCHEMA =================
export const updateProfileSchema = Joi.object({
  body: Joi.object({
    name: name,
    mobile: mobile,
    // Only allow specific fields to be updated
  }).min(1)
});

// ================= VALIDATE ID PARAM =================
export const idParamSchema = Joi.object({
  params: Joi.object({
    id: uuid.required()
  })
});

// ================= PAGINATION SCHEMA =================
export const paginationSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string(),
    order: Joi.string().valid('ASC', 'DESC').uppercase().default('DESC')
  })
});

// ================= SEARCH SCHEMA =================
export const searchSchema = Joi.object({
  query: Joi.object({
    q: Joi.string().trim().min(1).max(100),
    ...paginationSchema.describe().keys
  })
});

export default {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  idParamSchema,
  paginationSchema,
  searchSchema
};

