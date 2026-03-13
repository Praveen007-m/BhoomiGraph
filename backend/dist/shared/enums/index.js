"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorType = exports.BookingStatus = exports.PaymentStatus = exports.NotificationType = exports.AdvisoryStatus = exports.AdvisorySeverity = exports.AdvisoryCategory = exports.FarmStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["FARMER"] = "farmer";
    UserRole["PILOT"] = "pilot";
    UserRole["AGRONOMIST"] = "agronomist";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var FarmStatus;
(function (FarmStatus) {
    FarmStatus["PENDING"] = "pending";
    FarmStatus["APPROVED"] = "approved";
    FarmStatus["REJECTED"] = "rejected";
})(FarmStatus || (exports.FarmStatus = FarmStatus = {}));
var AdvisoryCategory;
(function (AdvisoryCategory) {
    AdvisoryCategory["PEST"] = "pest";
    AdvisoryCategory["IRRIGATION"] = "irrigation";
    AdvisoryCategory["NUTRITION"] = "nutrition";
    AdvisoryCategory["DISEASE"] = "disease";
    AdvisoryCategory["GENERAL"] = "general";
})(AdvisoryCategory || (exports.AdvisoryCategory = AdvisoryCategory = {}));
var AdvisorySeverity;
(function (AdvisorySeverity) {
    AdvisorySeverity["LOW"] = "low";
    AdvisorySeverity["MEDIUM"] = "medium";
    AdvisorySeverity["HIGH"] = "high";
    AdvisorySeverity["CRITICAL"] = "critical";
})(AdvisorySeverity || (exports.AdvisorySeverity = AdvisorySeverity = {}));
var AdvisoryStatus;
(function (AdvisoryStatus) {
    AdvisoryStatus["DRAFT"] = "draft";
    AdvisoryStatus["PUBLISHED"] = "published";
    AdvisoryStatus["RESOLVED"] = "resolved";
})(AdvisoryStatus || (exports.AdvisoryStatus = AdvisoryStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["AGRONOMY"] = "agronomy";
    NotificationType["BOOKING"] = "booking";
    NotificationType["SYSTEM"] = "system";
    NotificationType["WALLET"] = "wallet";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["SUCCESS"] = "success";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["IN_PROGRESS"] = "in-progress";
    BookingStatus["COMPLETED"] = "completed";
    BookingStatus["CANCELLED"] = "cancelled";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var SensorType;
(function (SensorType) {
    SensorType["SOIL_MOISTURE"] = "SoilSensor";
    SensorType["WEATHER_STATION"] = "WeatherStation";
    SensorType["PH_SENSOR"] = "PHSensor";
})(SensorType || (exports.SensorType = SensorType = {}));
