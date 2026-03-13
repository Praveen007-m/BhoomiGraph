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
exports.OtpLog = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
let OtpLog = class OtpLog extends sequelize_typescript_1.Model {
};
exports.OtpLog = OtpLog;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    }),
    __metadata("design:type", String)
], OtpLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], OtpLog.prototype, "mobile", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], OtpLog.prototype, "otp", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }),
    __metadata("design:type", Date)
], OtpLog.prototype, "expires_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], OtpLog.prototype, "is_used", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], OtpLog.prototype, "attempts", void 0);
exports.OtpLog = OtpLog = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'otp_logs',
        timestamps: true
    })
], OtpLog);
