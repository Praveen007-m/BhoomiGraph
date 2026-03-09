import { Request, Response } from 'express';
import { Farm } from '../models/Farm';
import { Sequelize } from 'sequelize-typescript';
(global as any).self = global; // Shim for shpjs Node compatibility
import toGeoJSON from '@tmcw/togeojson';
import { DOMParser } from '@xmldom/xmldom';
import shp from 'shpjs';
import logger from '../utils/logger';

export const createFarm = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { name, location, boundary, area_acres } = req.body;

    const farm = await Farm.create({
      name,
      location,
      boundary: {
        type: 'Polygon',
        coordinates: boundary.coordinates
      },
      area_acres,
      user_id: req.user.id
    });

    res.status(201).json({
      success: true,
      farm
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create farm"
    });
  }
};

export const getFarms = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const where: any = {};
    if (req.user.role?.toLowerCase() !== 'admin') {
      where.user_id = req.user.id;
    }

    const farms = await Farm.findAll({
      where,
      attributes: {
        include: [
          [
            Sequelize.literal(
              'ST_X(ST_Centroid(boundary))'
            ),
            'longitude'
          ],
          [
            Sequelize.literal(
              'ST_Y(ST_Centroid(boundary))'
            ),
            'latitude'
          ]
        ]
      }
    });

    res.json({ success: true, farms });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFarm = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;
    const farm = await Farm.findByPk(id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }
    await farm.update(req.body);
    res.json({ success: true, farm });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFarm = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;
    const farm = await Farm.findByPk(id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }
    await farm.destroy();
    res.json({ success: true, message: 'Farm deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const uploadBoundary = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    let geojson: any;

    if (file.originalname.endsWith('.kml')) {
      const kmlStr = file.buffer.toString();
      const kmlDom = new DOMParser().parseFromString(kmlStr, 'text/xml');
      geojson = (toGeoJSON as any).kml(kmlDom);
    } else if (file.originalname.endsWith('.zip')) {
      // Assuming zip contains shapefile
      geojson = await shp(file.buffer);
    } else if (file.originalname.endsWith('.geojson') || file.originalname.endsWith('.json')) {
      geojson = JSON.parse(file.buffer.toString());
    }

    if (!geojson) throw new Error('Unsupported or invalid GIS format');

    res.json({
      success: true,
      geojson
    });
  } catch (error: any) {
    logger.error(`Boundary Upload Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
