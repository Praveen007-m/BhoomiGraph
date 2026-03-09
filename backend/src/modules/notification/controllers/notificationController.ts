import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';

export const getMyNotifications = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const notifications = await NotificationService.getNotifications(req.user.id);
        res.json({ success: true, notifications });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markRead = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const { id } = req.params;
        const notification = await NotificationService.markAsRead(id, req.user.id);
        res.json({ success: true, notification });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
