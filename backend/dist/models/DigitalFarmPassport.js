"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalFarmPassport = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Farm_1 = require("./Farm");
let DigitalFarmPassport = class DigitalFarmPassport extends sequelize_typescript_1.Model {
    // ==================== METHODS ====================
    /**
     * Add NDVI record to history
     */
    addNDVIRecord(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const history = [...this.ndvi_history, record];
            yield this.update({ ndvi_history: history });
        });
    }
    /**
     * Add survey to history
     */
    addSurvey(survey) {
        return __awaiter(this, void 0, void 0, function* () {
            const history = [...this.survey_history, survey];
            yield this.update({
                survey_history: history,
                latest_survey: survey
            });
        });
    }
    /**
     * Update sensor summary
     */
    updateSensorSummary(summary) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = Object.assign(Object.assign({}, this.sensor_summary), summary);
            yield this.update({ sensor_summary: updated });
        });
    }
    /**
     * Verify the passport
     */
    verify(verifiedBy, notes) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update({
                status: {
                    verified: true,
                    verificationDate: new Date(),
                    verifiedBy,
                    verificationNotes: notes
                }
            });
        });
    }
    /**
     * Add document
     */
    addDocument(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = [...this.documents, doc];
            yield this.update({ documents: docs });
        });
    }
    /**
     * Update current crop
     */
    updateCurrentCrop(crop) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add current crop to history before updating
            if (this.current_crop) {
                const historyItem = {
                    cropType: this.current_crop.cropType,
                    season: this.getCurrentSeason(),
                    year: new Date().getFullYear(),
                    sowingDate: this.current_crop.sowingDate,
                    harvestDate: new Date()
                };
                const history = [...this.crop_history, historyItem];
                yield this.update({ crop_history: history });
            }
            yield this.update({ current_crop: crop });
        });
    }
    /**
     * Get current season based on month
     */
    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 6 && month <= 9)
            return 'kharif';
        if (month >= 10 && month <= 2)
            return 'rabi';
        return 'zaid';
    }
    /**
     * Get passport summary
     */
    getSummary() {
        return {
            id: this.id,
            farm_id: this.farm_id,
            verified: this.status.verified,
            latestNDVI: this.ndvi_history.length > 0
                ? this.ndvi_history[this.ndvi_history.length - 1]
                : null,
            lastSurvey: this.latest_survey,
            currentCrop: this.current_crop,
            sensorCount: this.sensor_summary.sensorCount,
            documentCount: this.documents.length
        };
    }
};
exports.DigitalFarmPassport = DigitalFarmPassport;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true
    }),
    __metadata("design:type", String)
], DigitalFarmPassport.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Farm_1.Farm),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        unique: true
    }),
    __metadata("design:type", String)
], DigitalFarmPassport.prototype, "farm_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Farm_1.Farm),
    __metadata("design:type", Farm_1.Farm)
], DigitalFarmPassport.prototype, "farm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        defaultValue: {
            verified: false,
            verificationDate: null,
            verifiedBy: null,
            verificationNotes: null
        }
    }),
    __metadata("design:type", Object)
], DigitalFarmPassport.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.GEOMETRY('POLYGON', 4326),
        allowNull: false
    }),
    __metadata("design:type", Object)
], DigitalFarmPassport.prototype, "boundary", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false
    }),
    __metadata("design:type", Object)
], DigitalFarmPassport.prototype, "centroid", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        defaultValue: []
    }),
    __metadata("design:type", Array)
], DigitalFarmPassport.prototype, "ndvi_history", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        defaultValue: []
    }),
    __metadata("design:type", Array)
], DigitalFarmPassport.prototype, "survey_history", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true
    }),
    __metadata("design:type", Object)
], DigitalFarmPassport.prototype, "latest_survey", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        defaultValue: {
            sensorCount: 0,
            lastReading: null,
            avgMoisture: null,
            avgTemperature: null
        }
    }),
    __metadata("design:type", Object)
], DigitalFarmPassport.prototype, "sensor_summary", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        defaultValue: []
    }),
    __metadata("design:type", Array)
], DigitalFarmPassport.prototype, "crop_history", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true
    }),
    __metadata("design:type", Object)
], DigitalFarmPassport.prototype, "current_crop", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true
    }),
    __metadata("design:type", Object)
], DigitalFarmPassport.prototype, "soil_report", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        defaultValue: []
    }),
    __metadata("design:type", Array)
], DigitalFarmPassport.prototype, "water_sources", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        defaultValue: []
    }),
    __metadata("design:type", Array)
], DigitalFarmPassport.prototype, "documents", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true
    }),
    __metadata("design:type", String)
], DigitalFarmPassport.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true
    }),
    __metadata("design:type", String)
], DigitalFarmPassport.prototype, "updated_by", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], DigitalFarmPassport.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], DigitalFarmPassport.prototype, "updatedAt", void 0);
exports.DigitalFarmPassport = DigitalFarmPassport = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'digital_farm_passports',
        timestamps: true
    })
], DigitalFarmPassport);
exports.default = DigitalFarmPassport;
