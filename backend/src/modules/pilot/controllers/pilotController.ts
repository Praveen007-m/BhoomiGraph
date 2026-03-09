import { Request, Response } from 'express';
import { PilotService } from '../services/pilotService';

export const getDashboard = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const stats = await PilotService.getDashboardStats(req.user.id);
        res.json({ success: true, ...stats });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAssignedJobs = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const jobs = await PilotService.getAssignedJobs(req.user.id);
        res.json({ success: true, jobs });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBookingDetails = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const job = await PilotService.getBookingById(id, req.user.id);
        res.json({ success: true, job });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateJobStatus = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const { id } = req.params;
        const { status } = req.body;
        const job = await PilotService.updateJobStatus(id, req.user.id, status);
        res.json({ success: true, job });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const uploadSurvey = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const files = req.files as { [fieldname: string]: (Express.Multer.File & { location: string })[] };

        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        const surveyData = {
            orthomosaic_url: files['orthomosaic']?.[0]?.location,
            shapefile_url: files['shapefile']?.[0]?.location,
            report_url: files['report']?.[0]?.location,
            preview_url: files['preview']?.[0]?.location,
        };

        const survey = await PilotService.saveSurveyData(req.user.id, id, surveyData);
        res.status(201).json({ success: true, survey });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
