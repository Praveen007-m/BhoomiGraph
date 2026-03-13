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
exports.ServiceBooking = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const Farm_1 = require("./Farm");
const enums_1 = require("../shared/enums");
let ServiceBooking = class ServiceBooking extends sequelize_typescript_1.Model {
};
exports.ServiceBooking = ServiceBooking;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], ServiceBooking.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ServiceBooking.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, "user_id"),
    __metadata("design:type", User_1.User)
], ServiceBooking.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Farm_1.Farm),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ServiceBooking.prototype, "farm_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Farm_1.Farm),
    __metadata("design:type", Farm_1.Farm)
], ServiceBooking.prototype, "farm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ServiceBooking.prototype, "service_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DOUBLE,
        allowNull: false,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], ServiceBooking.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(enums_1.BookingStatus)),
        defaultValue: enums_1.BookingStatus.CONFIRMED, // since wallet deducted instantly
    }),
    __metadata("design:type", String)
], ServiceBooking.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], ServiceBooking.prototype, "booking_date", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", String)
], ServiceBooking.prototype, "assigned_pilot_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, "assigned_pilot_id"),
    __metadata("design:type", User_1.User)
], ServiceBooking.prototype, "pilot", void 0);
exports.ServiceBooking = ServiceBooking = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "service_bookings",
        timestamps: true,
    })
], ServiceBooking);
