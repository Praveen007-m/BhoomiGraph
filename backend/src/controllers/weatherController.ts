import { Request, Response } from "express";
import axios from "axios";
import sequelize from "../config/db";
import { QueryTypes } from "sequelize";

export const getWeatherByFarmId = async (req: Request, res: Response) => {
  try {
    const { farmId } = req.params;

    if (!farmId) {
      return res.status(400).json({ message: "Farm ID is required" });
    }

    // 1️⃣ Get centroid from PostGIS
    const result: any[] = await sequelize.query(
      `
      SELECT 
        ST_Y(ST_Centroid(boundary)) AS lat,
        ST_X(ST_Centroid(boundary)) AS lon
      FROM farms
      WHERE id = :farmId
      `,
      {
        replacements: { farmId },
        type: QueryTypes.SELECT,
      }
    );

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
    const weatherResponse = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          units: "metric",
          appid: process.env.WEATHER_API_KEY,
        },
      }
    );

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

  } catch (error: any) {
    console.error(
      "Weather Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Failed to fetch weather",
    });
  }
};