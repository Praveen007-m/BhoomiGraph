"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchema = exports.paginationSchema = exports.idParamSchema = exports.updateProfileSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.refreshTokenSchema = exports.verifyOtpSchema = exports.sendOtpSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Authentication Validation Schemas
 *
 * Defines Joi schemas for all authentication endpoints.
 */
// Common validation rules
const email = joi_1.default.string()
    .email()
    .max(255)
    .trim()
    .lowercase()
    .messages({
    'string.email': 'Please provide a valid email address',
    'string.max': 'Email cannot exceed 255 characters',
    'string.empty': 'Email is required'
});
const password = joi_1.default.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password cannot exceed 128 characters',
    'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character'
});
const mobile = joi_1.default.string()
    .pattern(/^[6-9]\d{9}$/)
    .messages({
    'string.pattern.base': 'Please provide a valid 10-digit mobile number'
});
const name = joi_1.default.string()
    .min(2)
    .max(100)
    .trim()
    .pattern(/^[a-zA-Z\s'-]+$/)
    .messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 100 characters',
    'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes'
});
const role = joi_1.default.string()
    .valid('farmer', 'pilot', 'agronomist', 'admin')
    .messages({
    'any.only': 'Invalid role specified'
});
const otp = joi_1.default.string()
    .length(4)
    .pattern(/^\d+$/)
    .messages({
    'string.length': 'OTP must be 4 digits',
    'string.pattern.base': 'OTP must contain only numbers'
});
const uuid = joi_1.default.string()
    .uuid()
    .messages({
    'string.guid': 'Invalid ID format'
});
// ================= REGISTER SCHEMA =================
exports.registerSchema = joi_1.default.object({
    body: joi_1.default.object({
        name: name.required(),
        email: email.required(),
        password: password.required(),
        mobile: mobile,
        role: role.default('farmer')
    }).unknown(false)
});
// ================= LOGIN SCHEMA =================
exports.loginSchema = joi_1.default.object({
    body: joi_1.default.object({
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
exports.sendOtpSchema = joi_1.default.object({
    body: joi_1.default.object({
        mobile: mobile.required()
    })
});
exports.verifyOtpSchema = joi_1.default.object({
    body: joi_1.default.object({
        mobile: mobile.required(),
        otp: otp.required()
    })
});
// ================= REFRESH TOKEN SCHEMA =================
exports.refreshTokenSchema = joi_1.default.object({
    body: joi_1.default.object({
        refreshToken: joi_1.default.string()
            .required()
            .min(20)
            .messages({
            'string.empty': 'Refresh token is required',
            'string.min': 'Invalid refresh token'
        })
    })
});
// ================= CHANGE PASSWORD SCHEMA =================
exports.changePasswordSchema = joi_1.default.object({
    body: joi_1.default.object({
        currentPassword: password.required(),
        newPassword: password.required().disallow(joi_1.default.ref('currentPassword'))
            .messages({
            'any.invalid': 'New password must be different from current password'
        }),
        confirmPassword: joi_1.default.string()
            .valid(joi_1.default.ref('newPassword'))
            .required()
            .messages({
            'any.only': 'Passwords do not match'
        })
    })
});
// ================= FORGOT PASSWORD SCHEMA =================
exports.forgotPasswordSchema = joi_1.default.object({
    body: joi_1.default.object({
        email: email.required()
    })
});
// ================= RESET PASSWORD SCHEMA =================
exports.resetPasswordSchema = joi_1.default.object({
    body: joi_1.default.object({
        token: joi_1.default.string()
            .required()
            .min(20)
            .messages({
            'string.empty': 'Reset token is required',
            'string.min': 'Invalid reset token'
        }),
        newPassword: password.required(),
        confirmPassword: joi_1.default.string()
            .valid(joi_1.default.ref('newPassword'))
            .required()
            .messages({
            'any.only': 'Passwords do not match'
        })
    })
});
// ================= UPDATE PROFILE SCHEMA =================
exports.updateProfileSchema = joi_1.default.object({
    body: joi_1.default.object({
        name: name,
        mobile: mobile,
        // Only allow specific fields to be updated
    }).min(1)
});
// ================= VALIDATE ID PARAM =================
exports.idParamSchema = joi_1.default.object({
    params: joi_1.default.object({
        id: uuid.required()
    })
});
// ================= PAGINATION SCHEMA =================
exports.paginationSchema = joi_1.default.object({
    query: joi_1.default.object({
        page: joi_1.default.number().integer().min(1).default(1),
        limit: joi_1.default.number().integer().min(1).max(100).default(10),
        sort: joi_1.default.string(),
        order: joi_1.default.string().valid('ASC', 'DESC').uppercase().default('DESC')
    })
});
// ================= SEARCH SCHEMA =================
exports.searchSchema = joi_1.default.object({
    query: joi_1.default.object(Object.assign({ q: joi_1.default.string().trim().min(1).max(100) }, exports.paginationSchema.describe().keys))
});
exports.default = {
    registerSchema: exports.registerSchema,
    loginSchema: exports.loginSchema,
    sendOtpSchema: exports.sendOtpSchema,
    verifyOtpSchema: exports.verifyOtpSchema,
    refreshTokenSchema: exports.refreshTokenSchema,
    changePasswordSchema: exports.changePasswordSchema,
    forgotPasswordSchema: exports.forgotPasswordSchema,
    resetPasswordSchema: exports.resetPasswordSchema,
    updateProfileSchema: exports.updateProfileSchema,
    idParamSchema: exports.idParamSchema,
    paginationSchema: exports.paginationSchema,
    searchSchema: exports.searchSchema
};
