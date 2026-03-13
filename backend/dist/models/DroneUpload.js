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
exports.DroneUpload = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const ServiceBooking_1 = require("./ServiceBooking");
const User_1 = require("./User");
let DroneUpload = class DroneUpload extends sequelize_typescript_1.Model {
};
exports.DroneUpload = DroneUpload;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true
    }),
    __metadata("design:type", String)
], DroneUpload.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => ServiceBooking_1.ServiceBooking),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], DroneUpload.prototype, "booking_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => ServiceBooking_1.ServiceBooking),
    __metadata("design:type", ServiceBooking_1.ServiceBooking)
], DroneUpload.prototype, "booking", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], DroneUpload.prototype, "pilot_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User),
    __metadata("design:type", User_1.User)
], DroneUpload.prototype, "pilot", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], DroneUpload.prototype, "file_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], DroneUpload.prototype, "file_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], DroneUpload.prototype, "description", void 0);
exports.DroneUpload = DroneUpload = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'drone_uploads',
        timestamps: true
    })
], DroneUpload);
