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
exports.Farm = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const DroneProject_1 = require("./DroneProject");
const IoTDevice_1 = require("./IoTDevice");
const enums_1 = require("../shared/enums");
/*
|--------------------------------------------------------------------------
| 3️⃣  Properly Typed Model
|--------------------------------------------------------------------------
*/
let Farm = class Farm extends sequelize_typescript_1.Model {
};
exports.Farm = Farm;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true
    }),
    __metadata("design:type", String)
], Farm.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], Farm.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Farm.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], Farm.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], Farm.prototype, "location", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.GEOMETRY('POLYGON', 4326),
        allowNull: false
    }),
    __metadata("design:type", Object)
], Farm.prototype, "boundary", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.FLOAT,
        allowNull: true
    }),
    __metadata("design:type", Number)
], Farm.prototype, "area_acres", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Farm.prototype, "crop_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", String)
], Farm.prototype, "sowing_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Farm.prototype, "irrigation_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Farm.prototype, "soil_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        defaultValue: []
    }),
    __metadata("design:type", Array)
], Farm.prototype, "photos", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(enums_1.FarmStatus)),
        defaultValue: enums_1.FarmStatus.PENDING
    }),
    __metadata("design:type", String)
], Farm.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => DroneProject_1.DroneProject),
    __metadata("design:type", Array)
], Farm.prototype, "drone_projects", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => IoTDevice_1.IoTDevice),
    __metadata("design:type", Array)
], Farm.prototype, "iot_devices", void 0);
exports.Farm = Farm = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'farms',
        timestamps: true
    })
], Farm);
