import AWS from 'aws-sdk';
import logger from './logger';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT, // For MinIO or other S3-compatible storage
    s3ForcePathStyle: true, // often needed for MinIO
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'bhoomigraph-data';

export const uploadToS3 = async (file: Express.Multer.File, folder: string) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${folder}/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const result = await s3.upload(params).promise();
        return result.Location;
    } catch (error) {
        logger.error(`S3 Upload Error: ${error}`);
        throw error;
    }
};

export const getSignedDownloadUrl = (key: string, expires: number = 3600) => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            Expires: expires,
        };
        return s3.getSignedUrl('getObject', params);
    } catch (error) {
        logger.error(`S3 Signed URL Error: ${error}`);
        throw error;
    }
};

export default s3;
