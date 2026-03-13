"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeatherByFarmId = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = __importDefault(require("../config/db"));
const sequelize_1 = require("sequelize");
const getWeatherByFarmId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { farmId } = req.params;
        if (!farmId) {
            return res.status(400).json({ message: "Farm ID is required" });
        }
        // 1️⃣ Get centroid from PostGIS
        const result = yield db_1.default.query(`
      SELECT 
        ST_Y(ST_Centroid(boundary)) AS lat,
        ST_X(ST_Centroid(boundary)) AS lon
      FROM farms
      WHERE id = :farmId
      `, {
            replacements: { farmId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!result.length) {
            return res.status(404).json({ message: "Farm not found" });
        }
        const lat = parseFloat(result[0].lat);
        const lon = parseFloat(result[0].lon);
        if (!lat || !lon) {
            return res.status(400).json({
                message: "Invalid farm geometry. Could not compute coordinates.",
            });
        }
        if (!process.env.WEATHER_API_KEY) {
            console.error("Missing WEATHER_API_KEY in environment");
            return res.status(500).json({
                message: "Weather service not configured",
            });
        }
        // 2️⃣ Call OpenWeather API
        const weatherResponse = yield axios_1.default.get("https://api.openweathermap.org/data/2.5/weather", {
            params: {
                lat,
                lon,
                units: "metric",
                appid: process.env.WEATHER_API_KEY,
            },
        });
        const data = weatherResponse.data;
        // 3️⃣ Send cleaned response to frontend
        return res.json({
            location: data.name,
            current: {
                temp: data.main.temp,
                humidity: data.main.humidity,
                wind: data.wind.speed,
                condition: data.weather[0].main,
                description: data.weather[0].description,
            },
        });
    }
    catch (error) {
        console.error("Weather Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        return res.status(500).json({
            message: "Failed to fetch weather",
        });
    }
});
exports.getWeatherByFarmId = getWeatherByFarmId;
