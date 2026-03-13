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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SatelliteNDVIRecord = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Farm_1 = require("./Farm");
let SatelliteNDVIRecord = class SatelliteNDVIRecord extends sequelize_typescript_1.Model {
};
exports.SatelliteNDVIRecord = SatelliteNDVIRecord;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true
    }),
    __metadata("design:type", String)
], SatelliteNDVIRecord.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Farm_1.Farm),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], SatelliteNDVIRecord.prototype, "farm_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Farm_1.Farm),
    __metadata("design:type", Farm_1.Farm)
], SatelliteNDVIRecord.prototype, "farm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false
    }),
    __metadata("design:type", Date)
], SatelliteNDVIRecord.prototype, "acquisition_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.FLOAT,
        allowNull: true
    }),
    __metadata("design:type", Number)
], SatelliteNDVIRecord.prototype, "mean_ndvi", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.FLOAT,
        allowNull: true
    }),
    __metadata("design:type", Number)
], SatelliteNDVIRecord.prototype, "mean_ndre", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.FLOAT,
        allowNull: true
    }),
    __metadata("design:type", Number)
], SatelliteNDVIRecord.prototype, "mean_evi", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], SatelliteNDVIRecord.prototype, "true_color_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true
    }),
    __metadata("design:type", Object)
], SatelliteNDVIRecord.prototype, "metadata", void 0);
exports.SatelliteNDVIRecord = SatelliteNDVIRecord = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'satellite_ndvi_records',
        timestamps: true
    })
], SatelliteNDVIRecord);
