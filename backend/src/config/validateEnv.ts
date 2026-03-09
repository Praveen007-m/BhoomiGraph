import logger from '../utils/logger';

export const validateEnv = () => {
    const required = [
        'DB_HOST',
        'DB_USER',
        'DB_PASS',
        'DB_NAME',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET'
    ];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        logger.error(`❌ Missing critical environment variables: ${missing.join(', ')}`);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }

    // Twilio Check
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;

    if (!twilioSid || !twilioSid.startsWith('AC')) {
        logger.warn('⚠ Twilio Account SID is missing or invalid. SMS features will be simulated.');
    } else if (!twilioToken) {
        logger.warn('⚠ Twilio Auth Token is missing. SMS features will be simulated.');
    } else {
        logger.info('✅ Twilio configuration detected.');
    }

    logger.info('✅ Environment validation completed.');
};
