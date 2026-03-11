import logger from '../utils/logger';

/**
 * Environment Validation
 * 
 * Validates required environment variables for the application.
 * In production, missing critical variables will cause the server to exit.
 */

interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

export const validateEnv = (): EnvValidationResult => {
  const result: EnvValidationResult = {
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
    critical.push(
      'PORT',
      'NODE_ENV'
    );
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
    
    logger.error(`❌ Missing critical environment variables: ${missing.join(', ')}`);
    
    if (process.env.NODE_ENV === 'production') {
      logger.error('🚫 Cannot start server in production mode without critical environment variables');
      process.exit(1);
    } else {
      logger.warn('⚠️ Starting in development mode despite missing variables');
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
      logger.warn(`⚠️ AWS variables not configured: ${awsVars.join(', ')}. File uploads will be simulated.`);
    }
    
    if (paymentVars.length > 0) {
      logger.warn(`⚠️ Payment variables not configured: ${paymentVars.join(', ')}. Payment features will be unavailable.`);
    }
    
    if (twilioVars.length > 0) {
      logger.warn(`⚠️ Twilio variables not configured: ${twilioVars.join(', ')}. SMS features will be simulated.`);
    }
  }

  // Validate JWT_SECRET strength
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 32) {
    logger.warn('⚠️ JWT_SECRET is less than 32 characters. This is not recommended for production.');
    result.warnings.push('JWT_SECRET too short');
  }

  // Validate database connection string format
  const dbHost = process.env.DB_HOST;
  if (dbHost && !dbHost.includes('.')) {
    logger.warn('⚠️ DB_HOST does not look like a valid hostname.');
  }

  // Log successful configuration
  if (result.isValid) {
    logger.info('✅ All critical environment variables configured');
    
    if (result.warnings.length === 0) {
      logger.info('✅ All recommended services configured');
    } else {
      logger.info(`⚠️ ${result.warnings.length} optional service(s) not configured (see warnings above)`);
    }
  }

  // Environment info
  logger.info(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📋 Server Port: ${process.env.PORT || 5000}`);

  return result;
};

/**
 * Get required environment variable or throw error
 */
export const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
};

/**
 * Get optional environment variable with default
 */
export const getEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

/**
 * Check if running in production
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Check if running in development
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
};

export default validateEnv;
