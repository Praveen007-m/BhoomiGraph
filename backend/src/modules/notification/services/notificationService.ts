import { Notification } from '../../../models/Notification';
import { sendSMS } from '../../../utils/twilio';
import { NotificationType } from '../../../shared/enums';
import logger from '../../../utils/logger';

export class NotificationService {
    static async getNotifications(userId: string) {
        return await Notification.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']],
            limit: 50
        });
    }

    static async markAsRead(notificationId: string, userId: string) {
        const notification = await Notification.findOne({
            where: { id: notificationId, user_id: userId }
        });
        if (notification) {
            notification.is_read = true;
            await notification.save();
        }
        return notification;
    }

    static async createNotification(userId: string, title: string, message: string, type: NotificationType, mobile?: string) {
        const notification = await Notification.create({
            user_id: userId,
            title,
            message,
            type
        });

        if (mobile) {
            try {
                await sendSMS(mobile, `${title}: ${message}`);
            } catch (error) {
                logger.error(`Failed to send SMS notification: ${error}`);
            }
        }

        return notification;
    }
}
