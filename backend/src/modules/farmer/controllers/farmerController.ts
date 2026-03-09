import { Request, Response } from 'express';
import { FarmerService } from '../services/farmerService';

export const getDashboard = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const stats = await FarmerService.getDashboardStats(req.user.id);
        res.json({ success: true, stats });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createFarm = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const farm = await FarmerService.createFarm(req.user.id, req.body);
        res.status(201).json({ success: true, farm });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFarms = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const farms = await FarmerService.getFarms(req.user.id);
        res.json({ success: true, farms });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBookings = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const bookings = await FarmerService.getBookings(req.user.id);
        res.json({ success: true, bookings });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createBooking = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const booking = await FarmerService.createBooking(req.user.id, req.body);
        res.status(201).json({ success: true, booking });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getNDVI = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { farmId } = req.params;
        const data = await FarmerService.getNDVIInsights(req.user.id, farmId);
        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getIoTData = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { farmId } = req.params;
        const data = await FarmerService.getIoTData(req.user.id, farmId);
        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAlerts = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const alerts = await FarmerService.getAlerts(req.user.id);
        res.json({ success: true, alerts });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markAlertRead = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        await FarmerService.markAlertRead(req.user.id, id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDroneProjects = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const projects = await FarmerService.getDroneProjects(req.user.id);
        res.json({ success: true, projects });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
