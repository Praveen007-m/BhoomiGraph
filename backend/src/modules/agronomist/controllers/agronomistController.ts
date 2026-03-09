import { Request, Response } from 'express';
import { AgronomistService } from '../services/agronomistService';

export const getDashboard = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const stats = await AgronomistService.getDashboardStats(req.user.id);
        res.json({ success: true, ...stats });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFarms = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const farms = await AgronomistService.getFarmsDetailed();
        res.json({ success: true, farms });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFarmDetails = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const farm = await AgronomistService.getFarmAnalysis(id);
        res.json({ success: true, farm });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createAdvisory = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const advisory = await AgronomistService.createAdvisory(req.user.id, req.body);
        res.status(201).json({ success: true, advisory });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAdvisories = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const advisories = await AgronomistService.getAdvisories(req.user.id);
        res.json({ success: true, advisories });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAdvisoryDetails = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const advisory = await AgronomistService.getAdvisoryDetails(id, req.user.id);
        res.json({ success: true, advisory });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAdvisory = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const advisory = await AgronomistService.updateAdvisory(id, req.user.id, req.body);
        res.json({ success: true, advisory });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
