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
exports.NotificationService = void 0;
const Notification_1 = require("../../../models/Notification");
const twilio_1 = require("../../../utils/twilio");
const logger_1 = __importDefault(require("../../../utils/logger"));
class NotificationService {
    static getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Notification_1.Notification.findAll({
                where: { user_id: userId },
                order: [['createdAt', 'DESC']],
                limit: 50
            });
        });
    }
    static markAsRead(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield Notification_1.Notification.findOne({
                where: { id: notificationId, user_id: userId }
            });
            if (notification) {
                notification.is_read = true;
                yield notification.save();
            }
            return notification;
        });
    }
    static createNotification(userId, title, message, type, mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield Notification_1.Notification.create({
                user_id: userId,
                title,
                message,
                type
            });
            if (mobile) {
                try {
                    yield (0, twilio_1.sendSMS)(mobile, `${title}: ${message}`);
                }
                catch (error) {
                    logger_1.default.error(`Failed to send SMS notification: ${error}`);
                }
            }
            return notification;
        });
    }
}
exports.NotificationService = NotificationService;
