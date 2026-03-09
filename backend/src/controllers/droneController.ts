import { Request, Response } from 'express';
import { DroneProject } from '../models/DroneProject';

export const createProject = async (req: Request, res: Response) => {
    try {
        const { farm_id, project_name, flight_date, pilot_id } = req.body;
        const project = await DroneProject.create({
            farm_id,
            project_name,
            flight_date,
            pilot_id
        });
        res.status(201).json({ success: true, project });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProjects = async (req: Request, res: Response) => {
    try {
        const { farm_id } = req.query;
        const whereClause = farm_id ? { farm_id } : {};
        const projects = await DroneProject.findAll({ where: whereClause });
        res.json({ success: true, projects });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
