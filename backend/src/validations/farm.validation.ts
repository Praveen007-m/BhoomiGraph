import Joi from 'joi';

/**
 * Farm Validation Schemas
 * 
 * Defines Joi schemas for all farm-related endpoints.
 */

// Common validation rules
const uuid = Joi.string()
  .uuid()
  .messages({
    'string.guid': 'Invalid ID format'
  });

const name = Joi.string()
  .min(2)
  .max(200)
  .trim()
  .messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 200 characters',
    'string.empty': 'Name is required'
  });

const location = Joi.string()
  .min(2)
  .max(500)
  .trim()
  .messages({
    'string.min': 'Location must be at least 2 characters',
    'string.max': 'Location cannot exceed 500 characters'
  });

const areaAcres = Joi.number()
  .positive()
  .min(0.1)
  .max(10000)
  .precision(2)
  .messages({
    'number.positive': 'Area must be a positive number',
    'number.min': 'Area must be at least 0.1 acres',
    'number.max': 'Area cannot exceed 10000 acres'
  });

const cropType = Joi.string()
  .max(100)
  .trim()
  .messages({
    'string.max': 'Crop type cannot exceed 100 characters'
  });

const soilType = Joi.string()
  .valid(
    'clay',
    'sandy',
    'loamy',
    'silty',
    'peaty',
    'chalky',
    'clay-loam',
    'sandy-loam',
    'silt-loam'
  )
  .messages({
    'any.only': 'Invalid soil type'
  });

const irrigationType = Joi.string()
  .valid(
    'rainfed',
    'drip',
    'sprinkler',
    'furrow',
    'flood',
    'center-pivot',
    'subsurface'
  )
  .messages({
    'any.only': 'Invalid irrigation type'
  });

const boundary = Joi.object({
  type: Joi.string().valid('Polygon').required(),
  coordinates: Joi.array().items(
    Joi.array().items(
      Joi.array().items(Joi.number().required())
    )
  ).min(1).required()
});

const status = Joi.string()
  .valid('pending', 'active', 'inactive', 'archived')
  .messages({
    'any.only': 'Invalid status'
  });

// ================= CREATE FARM SCHEMA =================
export const createFarmSchema = Joi.object({
  body: Joi.object({
    name: name.required(),
    location,
    boundary: boundary.required(),
    area_acres: areaAcres.required(),
    crop_type: cropType,
    sowing_date: Joi.date().iso().max('now').messages({
      'date.max': 'Sowing date cannot be in the future',
      'date.iso': 'Invalid date format'
    }),
    irrigation_type: irrigationType,
    soil_type: soilType,
    photos: Joi.array().items(
      Joi.string().uri()
    ).max(10).messages({
      'array.max': 'Cannot upload more than 10 photos',
      'string.uri': 'Invalid photo URL'
    })
  }).unknown(false)
});

// ================= UPDATE FARM SCHEMA =================
export const updateFarmSchema = Joi.object({
  params: Joi.object({
    id: uuid.required()
  }),
  body: Joi.object({
    name,
    location,
    boundary,
    area_acres: areaAcres,
    crop_type: cropType,
    sowing_date: Joi.date().iso(),
    irrigation_type: irrigationType,
    soil_type: soilType,
    photos: Joi.array().items(
      Joi.string().uri()
    ).max(10),
    status
  }).min(1).unknown(false)
});

// ================= DELETE FARM SCHEMA =================
export const deleteFarmSchema = Joi.object({
  params: Joi.object({
    id: uuid.required()
  })
});

// ================= GET FARMS SCHEMA =================
export const getFarmsSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('name', 'createdAt', 'area_acres', 'status'),
    order: Joi.string().valid('ASC', 'DESC').uppercase().default('DESC'),
    status,
    crop_type: Joi.string().trim(),
    search: Joi.string().trim().max(100)
  })
});

// ================= GET SINGLE FARM SCHEMA =================
export const getFarmSchema = Joi.object({
  params: Joi.object({
    id: uuid.required()
  })
});

// ================= BOUNDARY UPLOAD SCHEMA =================
export const uploadBoundarySchema = Joi.object({
  body: Joi.object({
    farmId: uuid
  }),
  file: Joi.any().required()
});

// ================= FILE VALIDATION SCHEMA =================
export const fileValidationSchema = Joi.object({
  file: Joi.any()
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
export const bulkImportSchema = Joi.object({
  body: Joi.object({
    farms: Joi.array()
      .items(createFarmSchema)
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
export const updateFarmStatusSchema = Joi.object({
  params: Joi.object({
    id: uuid.required()
  }),
  body: Joi.object({
    status: status.required()
  })
});

// ================= FARM FILTER SCHEMA =================
export const farmFilterSchema = Joi.object({
  query: Joi.object({
    user_id: uuid,
    status,
    crop_type: Joi.string().trim(),
    min_area: Joi.number().positive(),
    max_area: Joi.number().positive().min(Joi.ref('min_area')),
    irrigation_type: irrigationType,
    soil_type: soilType,
    from_date: Joi.date().iso(),
    to_date: Joi.date().iso().min(Joi.ref('from_date')),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  })
});

export default {
  createFarmSchema,
  updateFarmSchema,
  deleteFarmSchema,
  getFarmsSchema,
  getFarmSchema,
  uploadBoundarySchema,
  fileValidationSchema,
  bulkImportSchema,
  updateFarmStatusSchema,
  farmFilterSchema
};

