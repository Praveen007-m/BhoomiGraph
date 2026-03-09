import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../utils/s3';
import { Request } from 'express';

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'bhoomigraph-data';

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
    } else {
        cb(new Error('Invalid file type. Only GIS (TIF, SHP), CSV, and PDF are allowed.'));
    }
};

export const surveyUpload = multer({
    storage: multerS3({
        s3: s3 as any,
        bucket: BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
            const bookingId = (req.params as any).id || 'misc';
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
