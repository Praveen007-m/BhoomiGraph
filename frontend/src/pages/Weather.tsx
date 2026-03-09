import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets, Wind, MapPin, Sun, CloudSun } from "lucide-react";
import { farmService } from "@/services/farmService";

interface Farm {
  id: string;
  name: string;
}

export default function Weather() {
  const navigate = useNavigate();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // ✅ Load farms
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await farmService.getAllFarms();
        setFarms(res.farms || []);
      } catch (err) {
        console.error("Failed to load farms", err);
      }
    };

    fetchFarms();
  }, []);

  // ✅ Load weather when farm changes
  useEffect(() => {
    if (!selectedFarmId) {
      setWeather(null);
      return;
    }

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError("");
        setWeather(null);

        const res = await axios.get(
          `http://localhost:5000/api/weather/${selectedFarmId}`
        );

        setWeather(res.data);
      } catch (err: any) {
        console.error("Weather fetch failed", err);
        setError("Unable to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedFarmId]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Weather Forecast
        </h1>
        <p className="text-muted-foreground mt-1">
          View real-time weather conditions for your farms.
        </p>
      </div>

      {/* Farm Dropdown */}
      <select
        className="border border-border rounded-lg px-4 py-2 w-72"
        value={selectedFarmId}
        onChange={(e) => setSelectedFarmId(e.target.value)}
      >
        <option value="">Select Farm</option>
        {farms.map((farm) => (
          <option key={farm.id} value={farm.id}>
            {farm.name}
          </option>
        ))}
      </select>

      {/* 🔵 Empty State */}
      {!selectedFarmId && (
        <div className="mt-20 flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center">
            <CloudSun className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800">
            Select a Farm to View Weather
          </h2>

          <p className="text-gray-500 max-w-md">
            Choose one of your farms from the dropdown above to see
            live temperature, humidity, wind speed and conditions.
          </p>

          <button
            onClick={() => navigate("/farms")}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg shadow hover:opacity-90 transition"
          >
            Go to My Farms
          </button>
        </div>
      )}

      {/* 🔄 Loading */}
      {loading && (
        <div className="text-center mt-10 text-muted-foreground">
          Loading weather data...
        </div>
      )}

      {/* ❌ Error */}
      {error && (
        <div className="text-center text-red-500 mt-6">
          {error}
        </div>
      )}

      {/* ✅ Weather UI */}
      {weather && !loading && (
        <>
          {/* Main Weather Card */}
          <Card className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg">
            <CardContent className="p-8 flex justify-between items-center">
              <div>
                <h2 className="text-5xl font-bold mb-2">
                  {weather.current.temp}°C
                </h2>
                <p className="text-xl capitalize">
                  {weather.current.condition}
                </p>
                <p className="text-sm opacity-80">
                  {weather.current.description}
                </p>

                <div className="flex items-center gap-2 mt-3 text-sm">
                  <MapPin className="h-4 w-4" />
                  {weather.location}
                </div>
              </div>

              <Sun className="h-20 w-20 opacity-80" />
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <Droplets className="text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Humidity
                  </p>
                  <p className="text-xl font-semibold">
                    {weather.current.humidity}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <Wind className="text-gray-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Wind Speed
                  </p>
                  <p className="text-xl font-semibold">
                    {weather.current.wind} km/h
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  Condition
                </p>
                <p className="text-xl font-semibold">
                  {weather.current.condition}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}