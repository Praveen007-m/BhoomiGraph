import twilio from 'twilio';
import logger from './logger';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Only initialize if SID is valid and starts with AC
const isTwilioConfigured = accountSid && accountSid.startsWith('AC') && authToken && fromNumber;

export const twilioClient = isTwilioConfigured ? twilio(accountSid, authToken) : null;

export const sendSMS = async (to: string, message: string) => {
    try {
        if (!twilioClient || !fromNumber) {
            logger.warn(`SMS simulation: To ${to} - Msg: ${message}`);
            return { sid: 'simulated_sid' };
        }

        const response = await twilioClient.messages.create({
            body: message,
            from: fromNumber,
            to: to
        });

        logger.info(`SMS sent successfully to ${to}. SID: ${response.sid}`);
        return response;
    } catch (error: any) {
        logger.error(`Failed to send SMS to ${to}: ${error.message}`);
        throw error;
    }
};
