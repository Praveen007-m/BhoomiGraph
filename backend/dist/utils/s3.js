"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedDownloadUrl = exports.uploadToS3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const logger_1 = __importDefault(require("./logger"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT, // For MinIO or other S3-compatible storage
    s3ForcePathStyle: true, // often needed for MinIO
});
const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'bhoomigraph-data';
const uploadToS3 = (file, folder) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${folder}/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try {
        const result = yield s3.upload(params).promise();
        return result.Location;
    }
    catch (error) {
        logger_1.default.error(`S3 Upload Error: ${error}`);
        throw error;
    }
});
exports.uploadToS3 = uploadToS3;
const getSignedDownloadUrl = (key, expires = 3600) => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            Expires: expires,
        };
        return s3.getSignedUrl('getObject', params);
    }
    catch (error) {
        logger_1.default.error(`S3 Signed URL Error: ${error}`);
        throw error;
    }
};
exports.getSignedDownloadUrl = getSignedDownloadUrl;
exports.default = s3;
