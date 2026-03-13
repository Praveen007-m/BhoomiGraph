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
exports.IoTDevice = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Farm_1 = require("./Farm");
const enums_1 = require("../shared/enums");
let IoTDevice = class IoTDevice extends sequelize_typescript_1.Model {
};
exports.IoTDevice = IoTDevice;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true
    }),
    __metadata("design:type", String)
], IoTDevice.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Farm_1.Farm),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], IoTDevice.prototype, "farm_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Farm_1.Farm),
    __metadata("design:type", Farm_1.Farm)
], IoTDevice.prototype, "farm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true
    }),
    __metadata("design:type", String)
], IoTDevice.prototype, "device_uid", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], IoTDevice.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(enums_1.SensorType)),
        allowNull: true
    }),
    __metadata("design:type", String)
], IoTDevice.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true
    }),
    __metadata("design:type", Boolean)
], IoTDevice.prototype, "is_active", void 0);
exports.IoTDevice = IoTDevice = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'iot_devices',
        timestamps: true
    })
], IoTDevice);
