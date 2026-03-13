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
exports.DroneSurvey = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const ServiceBooking_1 = require("./ServiceBooking");
let DroneSurvey = class DroneSurvey extends sequelize_typescript_1.Model {
};
exports.DroneSurvey = DroneSurvey;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true
    }),
    __metadata("design:type", String)
], DroneSurvey.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => ServiceBooking_1.ServiceBooking),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], DroneSurvey.prototype, "booking_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => ServiceBooking_1.ServiceBooking),
    __metadata("design:type", ServiceBooking_1.ServiceBooking)
], DroneSurvey.prototype, "booking", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], DroneSurvey.prototype, "orthomosaic_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], DroneSurvey.prototype, "preview_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], DroneSurvey.prototype, "shapefile_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], DroneSurvey.prototype, "report_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        defaultValue: sequelize_typescript_1.DataType.NOW
    }),
    __metadata("design:type", Date)
], DroneSurvey.prototype, "uploaded_at", void 0);
exports.DroneSurvey = DroneSurvey = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'drone_surveys',
        timestamps: true
    })
], DroneSurvey);
