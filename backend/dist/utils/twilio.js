"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = exports.twilioClient = void 0;
const twilio_1 = __importDefault(require("twilio"));
const logger_1 = __importDefault(require("./logger"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
// Only initialize if SID is valid and starts with AC
const isTwilioConfigured = accountSid && accountSid.startsWith('AC') && authToken && fromNumber;
exports.twilioClient = isTwilioConfigured ? (0, twilio_1.default)(accountSid, authToken) : null;
const sendSMS = (to, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!exports.twilioClient || !fromNumber) {
            logger_1.default.warn(`SMS simulation: To ${to} - Msg: ${message}`);
            return { sid: 'simulated_sid' };
        }
        const response = yield exports.twilioClient.messages.create({
            body: message,
            from: fromNumber,
            to: to
        });
        logger_1.default.info(`SMS sent successfully to ${to}. SID: ${response.sid}`);
        return response;
    }
    catch (error) {
        logger_1.default.error(`Failed to send SMS to ${to}: ${error.message}`);
        throw error;
    }
});
exports.sendSMS = sendSMS;
