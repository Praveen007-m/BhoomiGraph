import { Request, Response } from 'express';
import { IoTDevice } from '../models/IoTDevice';
import { IoTData } from '../models/IoTData';
export const registerDevice = async (req: Request, res: Response) => {
    try {
        const { farm_id, device_uid, name, type } = req.body;
        const device = await IoTDevice.create({
            farm_id,
            device_uid,
            name,
            type
        });
        res.status(201).json({ success: true, device });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDevices = async (req: Request, res: Response) => {
    try {
        const { farm_id } = req.params;
        const where: any = {};
        if (farm_id) where.farm_id = farm_id;

        const devices = await IoTDevice.findAll({
            where,
            include: [{
                model: IoTData,
                limit: 10,
                order: [['createdAt', 'DESC']]
            }]
        });

        // Grouping logic for frontend (flattening depths)
        const devicesWithDepths = devices.map(device => {
            const data = (device as any).IoTData || [];
            const depths: any = {};
            data.forEach((d: any) => {
                if (d.depth_cm && !depths[d.depth_cm]) {
                    depths[d.depth_cm] = d.value;
                }
            });
            return {
                ...device.toJSON(),
                value: data[0]?.value || 0,
                unit: data[0]?.unit || '%',
                depths
            };
        });

        res.json({ success: true, devices: devicesWithDepths });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
