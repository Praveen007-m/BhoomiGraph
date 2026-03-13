"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.surveyUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const s3_1 = __importDefault(require("../utils/s3"));
const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'bhoomigraph-data';
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/tiff',
        'image/tif',
        'application/pdf',
        'application/zip',
        'text/csv',
        'application/octet-stream' // Often used for .shp segments
    ];
    if (allowedTypes.includes(file.mimetype) ||
        file.originalname.match(/\.(tiff|tif|shp|dbf|shx|prj|zip|csv|pdf)$/i)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only GIS (TIF, SHP), CSV, and PDF are allowed.'));
    }
};
exports.surveyUpload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3_1.default,
        bucket: BUCKET_NAME,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const bookingId = req.params.id || 'misc';
            const folder = `surveys/${bookingId}`;
            const fileName = `${Date.now()}_${file.originalname}`;
            cb(null, `${folder}/${fileName}`);
        }
    }),
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 * 1024 // 10 GB limit
    }
});
