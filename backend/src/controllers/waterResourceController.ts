import { Request, Response } from 'express';
import { WaterResource } from '../models/WaterResource';
import logger from '../utils/logger';

export const createWaterResource = async (req: Request, res: Response) => {
    try {
        const { farm_id, type, geometry, water_level } = req.body;
        const resource = await WaterResource.create({
            farm_id,
            type,
            geometry,
            water_level,
            last_measured: new Date()
        });
        res.status(201).json({ success: true, resource });
    } catch (error: any) {
        logger.error(`Create Water Resource Error: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getWaterResources = async (req: Request, res: Response) => {
    try {
        const { farm_id } = req.query;
        const where = farm_id ? { farm_id } : {};
        const resources = await WaterResource.findAll({ where });
        res.json({ success: true, resources });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateWaterLevel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { water_level } = req.body;
        const resource = await WaterResource.findByPk(id);
        if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

        resource.water_level = water_level;
        resource.last_measured = new Date();
        await resource.save();

        res.json({ success: true, resource });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
