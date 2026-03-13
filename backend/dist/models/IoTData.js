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
exports.IoTData = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const IoTDevice_1 = require("./IoTDevice");
let IoTData = class IoTData extends sequelize_typescript_1.Model {
};
exports.IoTData = IoTData;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true
    }),
    __metadata("design:type", String)
], IoTData.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => IoTDevice_1.IoTDevice),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], IoTData.prototype, "device_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => IoTDevice_1.IoTDevice),
    __metadata("design:type", IoTDevice_1.IoTDevice)
], IoTData.prototype, "device", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.FLOAT,
        allowNull: false
    }),
    __metadata("design:type", Number)
], IoTData.prototype, "value", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], IoTData.prototype, "unit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Depth in cm (e.g., 10, 30, 60)'
    }),
    __metadata("design:type", Number)
], IoTData.prototype, "depth_cm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true
    }),
    __metadata("design:type", Object)
], IoTData.prototype, "metadata", void 0);
exports.IoTData = IoTData = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'iot_data',
        timestamps: true
    })
], IoTData);
