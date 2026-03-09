import { Request, Response } from 'express';
import { SatelliteNDVIRecord } from '../models/SatelliteNDVIRecord';

export const storeNDVI = async (req: Request, res: Response) => {
    try {
        const { farm_id, acquisition_date, mean_ndvi, image_url, metadata } = req.body;
        const record = await SatelliteNDVIRecord.create({
            farm_id,
            acquisition_date,
            mean_ndvi,
            image_url,
            metadata
        });
        res.status(201).json({ success: true, record });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getNDVI = async (req: Request, res: Response) => {
    try {
        const { farm_id } = req.params;
        const records = await SatelliteNDVIRecord.findAll({
            where: { farm_id },
            order: [['acquisition_date', 'DESC']]
        });
        res.json({ success: true, records });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
