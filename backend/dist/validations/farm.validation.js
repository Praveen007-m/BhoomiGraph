"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.farmFilterSchema = exports.updateFarmStatusSchema = exports.bulkImportSchema = exports.fileValidationSchema = exports.uploadBoundarySchema = exports.getFarmSchema = exports.getFarmsSchema = exports.deleteFarmSchema = exports.updateFarmSchema = exports.createFarmSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Farm Validation Schemas
 *
 * Defines Joi schemas for all farm-related endpoints.
 */
// Common validation rules
const uuid = joi_1.default.string()
    .uuid()
    .messages({
    'string.guid': 'Invalid ID format'
});
const name = joi_1.default.string()
    .min(2)
    .max(200)
    .trim()
    .messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 200 characters',
    'string.empty': 'Name is required'
});
const location = joi_1.default.string()
    .min(2)
    .max(500)
    .trim()
    .messages({
    'string.min': 'Location must be at least 2 characters',
    'string.max': 'Location cannot exceed 500 characters'
});
const areaAcres = joi_1.default.number()
    .positive()
    .min(0.1)
    .max(10000)
    .precision(2)
    .messages({
    'number.positive': 'Area must be a positive number',
    'number.min': 'Area must be at least 0.1 acres',
    'number.max': 'Area cannot exceed 10000 acres'
});
const cropType = joi_1.default.string()
    .max(100)
    .trim()
    .messages({
    'string.max': 'Crop type cannot exceed 100 characters'
});
const soilType = joi_1.default.string()
    .valid('clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky', 'clay-loam', 'sandy-loam', 'silt-loam')
    .messages({
    'any.only': 'Invalid soil type'
});
const irrigationType = joi_1.default.string()
    .valid('rainfed', 'drip', 'sprinkler', 'furrow', 'flood', 'center-pivot', 'subsurface')
    .messages({
    'any.only': 'Invalid irrigation type'
});
const boundary = joi_1.default.object({
    type: joi_1.default.string().valid('Polygon').required(),
    coordinates: joi_1.default.array().items(joi_1.default.array().items(joi_1.default.array().items(joi_1.default.number().required()))).min(1).required()
});
const status = joi_1.default.string()
    .valid('pending', 'active', 'inactive', 'archived')
    .messages({
    'any.only': 'Invalid status'
});
// ================= CREATE FARM SCHEMA =================
exports.createFarmSchema = joi_1.default.object({
    body: joi_1.default.object({
        name: name.required(),
        location,
        boundary: boundary.required(),
        area_acres: areaAcres.required(),
        crop_type: cropType,
        sowing_date: joi_1.default.date().iso().max('now').messages({
            'date.max': 'Sowing date cannot be in the future',
            'date.iso': 'Invalid date format'
        }),
        irrigation_type: irrigationType,
        soil_type: soilType,
        photos: joi_1.default.array().items(joi_1.default.string().uri()).max(10).messages({
            'array.max': 'Cannot upload more than 10 photos',
            'string.uri': 'Invalid photo URL'
        })
    }).unknown(false)
});
// ================= UPDATE FARM SCHEMA =================
exports.updateFarmSchema = joi_1.default.object({
    params: joi_1.default.object({
        id: uuid.required()
    }),
    body: joi_1.default.object({
        name,
        location,
        boundary,
        area_acres: areaAcres,
        crop_type: cropType,
        sowing_date: joi_1.default.date().iso(),
        irrigation_type: irrigationType,
        soil_type: soilType,
        photos: joi_1.default.array().items(joi_1.default.string().uri()).max(10),
        status
    }).min(1).unknown(false)
});
// ================= DELETE FARM SCHEMA =================
exports.deleteFarmSchema = joi_1.default.object({
    params: joi_1.default.object({
        id: uuid.required()
    })
});
// ================= GET FARMS SCHEMA =================
exports.getFarmsSchema = joi_1.default.object({
    query: joi_1.default.object({
        page: joi_1.default.number().integer().min(1).default(1),
        limit: joi_1.default.number().integer().min(1).max(100).default(10),
        sort: joi_1.default.string().valid('name', 'createdAt', 'area_acres', 'status'),
        order: joi_1.default.string().valid('ASC', 'DESC').uppercase().default('DESC'),
        status,
        crop_type: joi_1.default.string().trim(),
        search: joi_1.default.string().trim().max(100)
    })
});
// ================= GET SINGLE FARM SCHEMA =================
exports.getFarmSchema = joi_1.default.object({
    params: joi_1.default.object({
        id: uuid.required()
    })
});
// ================= BOUNDARY UPLOAD SCHEMA =================
exports.uploadBoundarySchema = joi_1.default.object({
    body: joi_1.default.object({
        farmId: uuid
    }),
    file: joi_1.default.any().required()
});
// ================= FILE VALIDATION SCHEMA =================
exports.fileValidationSchema = joi_1.default.object({
    file: joi_1.default.any()
        .required()
        .custom((value, helpers) => {
        if (!value) {
            return helpers.error('any.required');
        }
        const allowedMimeTypes = [
            'application/vnd.google-earth.kml+xml',
            'application/kml',
            'application/zip',
            'application/x-zip-compressed',
            'application/geojson',
            'application/json',
            'application/ld+json'
        ];
        const allowedExtensions = ['.kml', '.kmz', '.zip', '.geojson', '.json'];
        // Check mime type
        if (value.mimetype && !allowedMimeTypes.includes(value.mimetype)) {
            return helpers.error('file.invalidType');
        }
        // Check extension
        const filename = value.originalname || '';
        const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return helpers.error('file.invalidExtension');
        }
        // Check file size (10MB limit)
        if (value.size && value.size > 10 * 1024 * 1024) {
            return helpers.error('file.sizeLimit');
        }
        return value;
    })
        .messages({
        'any.required': 'File is required',
        'file.invalidType': 'Invalid file type. Allowed: KML, KMZ, ZIP, GeoJSON',
        'file.invalidExtension': 'Invalid file extension',
        'file.sizeLimit': 'File size cannot exceed 10MB'
    })
});
// ================= BULK IMPORT SCHEMA =================
exports.bulkImportSchema = joi_1.default.object({
    body: joi_1.default.object({
        farms: joi_1.default.array()
            .items(exports.createFarmSchema)
            .min(1)
            .max(100)
            .required()
            .messages({
            'array.min': 'At least one farm is required',
            'array.max': 'Cannot import more than 100 farms at once'
        })
    })
});
// ================= FARM STATUS UPDATE SCHEMA =================
exports.updateFarmStatusSchema = joi_1.default.object({
    params: joi_1.default.object({
        id: uuid.required()
    }),
    body: joi_1.default.object({
        status: status.required()
    })
});
// ================= FARM FILTER SCHEMA =================
exports.farmFilterSchema = joi_1.default.object({
    query: joi_1.default.object({
        user_id: uuid,
        status,
        crop_type: joi_1.default.string().trim(),
        min_area: joi_1.default.number().positive(),
        max_area: joi_1.default.number().positive().min(joi_1.default.ref('min_area')),
        irrigation_type: irrigationType,
        soil_type: soilType,
        from_date: joi_1.default.date().iso(),
        to_date: joi_1.default.date().iso().min(joi_1.default.ref('from_date')),
        page: joi_1.default.number().integer().min(1).default(1),
        limit: joi_1.default.number().integer().min(1).max(100).default(10)
    })
});
exports.default = {
    createFarmSchema: exports.createFarmSchema,
    updateFarmSchema: exports.updateFarmSchema,
    deleteFarmSchema: exports.deleteFarmSchema,
    getFarmsSchema: exports.getFarmsSchema,
    getFarmSchema: exports.getFarmSchema,
    uploadBoundarySchema: exports.uploadBoundarySchema,
    fileValidationSchema: exports.fileValidationSchema,
    bulkImportSchema: exports.bulkImportSchema,
    updateFarmStatusSchema: exports.updateFarmStatusSchema,
    farmFilterSchema: exports.farmFilterSchema
};
