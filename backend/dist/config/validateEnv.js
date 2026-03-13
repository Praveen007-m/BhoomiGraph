"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevelopment = exports.isProduction = exports.getEnv = exports.getRequiredEnv = exports.validateEnv = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const validateEnv = () => {
    const result = {
        isValid: true,
        missing: [],
        warnings: []
    };
    // Critical environment variables (required in all environments)
    const critical = [
        'DB_HOST',
        'DB_USER',
        'DB_PASS',
        'DB_NAME',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET'
    ];
    // Production-specific required variables
    if (process.env.NODE_ENV === 'production') {
        critical.push('PORT', 'NODE_ENV');
    }
    // Optional but recommended variables
    const recommended = [
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'AWS_BUCKET',
        'RAZORPAY_KEY',
        'RAZORPAY_SECRET',
        'TWILIO_ACCOUNT_SID',
        'TWILIO_AUTH_TOKEN'
    ];
    // Check critical variables
    const missing = critical.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        result.missing = missing;
        result.isValid = false;
        logger_1.default.error(`❌ Missing critical environment variables: ${missing.join(', ')}`);
        if (process.env.NODE_ENV === 'production') {
            logger_1.default.error('🚫 Cannot start server in production mode without critical environment variables');
            process.exit(1);
        }
        else {
            logger_1.default.warn('⚠️ Starting in development mode despite missing variables');
        }
    }
    // Check recommended variables
    const notConfigured = recommended.filter((key) => !process.env[key]);
    if (notConfigured.length > 0) {
        result.warnings = notConfigured;
        // Group warnings by service
        const awsVars = notConfigured.filter(v => v.startsWith('AWS'));
        const paymentVars = notConfigured.filter(v => v.startsWith('RAZORPAY'));
        const twilioVars = notConfigured.filter(v => v.startsWith('TWILIO'));
        if (awsVars.length > 0) {
            logger_1.default.warn(`⚠️ AWS variables not configured: ${awsVars.join(', ')}. File uploads will be simulated.`);
        }
        if (paymentVars.length > 0) {
            logger_1.default.warn(`⚠️ Payment variables not configured: ${paymentVars.join(', ')}. Payment features will be unavailable.`);
        }
        if (twilioVars.length > 0) {
            logger_1.default.warn(`⚠️ Twilio variables not configured: ${twilioVars.join(', ')}. SMS features will be simulated.`);
        }
    }
    // Validate JWT_SECRET strength
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
        logger_1.default.warn('⚠️ JWT_SECRET is less than 32 characters. This is not recommended for production.');
        result.warnings.push('JWT_SECRET too short');
    }
    // Validate database connection string format
    const dbHost = process.env.DB_HOST;
    if (dbHost && !dbHost.includes('.')) {
        logger_1.default.warn('⚠️ DB_HOST does not look like a valid hostname.');
    }
    // Log successful configuration
    if (result.isValid) {
        logger_1.default.info('✅ All critical environment variables configured');
        if (result.warnings.length === 0) {
            logger_1.default.info('✅ All recommended services configured');
        }
        else {
            logger_1.default.info(`⚠️ ${result.warnings.length} optional service(s) not configured (see warnings above)`);
        }
    }
    // Environment info
    logger_1.default.info(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger_1.default.info(`📋 Server Port: ${process.env.PORT || 5000}`);
    return result;
};
exports.validateEnv = validateEnv;
/**
 * Get required environment variable or throw error
 */
const getRequiredEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Required environment variable ${key} is not set`);
    }
    return value;
};
exports.getRequiredEnv = getRequiredEnv;
/**
 * Get optional environment variable with default
 */
const getEnv = (key, defaultValue) => {
    return process.env[key] || defaultValue;
};
exports.getEnv = getEnv;
/**
 * Check if running in production
 */
const isProduction = () => {
    return process.env.NODE_ENV === 'production';
};
exports.isProduction = isProduction;
/**
 * Check if running in development
 */
const isDevelopment = () => {
    return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
};
exports.isDevelopment = isDevelopment;
exports.default = exports.validateEnv;
