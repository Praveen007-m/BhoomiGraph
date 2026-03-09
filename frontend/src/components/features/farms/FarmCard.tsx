import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useState,useEffect } from "react";
import { iotService } from "@/services/iotService";
import type { LatLngTuple } from "leaflet";

interface FarmCardProps {
    farm: any;
    activeFarmId: string | null;
    showNdvi: boolean;
    showDrone: boolean;
    ndviData: any;
    onToggleNdvi: (farm: any) => void;
    onToggleDrone: (farm: any) => void;
}

export function FarmCard({
    farm,
    activeFarmId,
    showNdvi,
    showDrone,
    ndviData,
    onToggleNdvi,
    onToggleDrone
}: FarmCardProps) {
    const [weather, setWeather] = useState<any>(null);
    const isNdviActive = activeFarmId === farm.id && showNdvi;
    const isDroneActive = activeFarmId === farm.id && showDrone;

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                if (!farm.boundary?.coordinates?.length) return;

                const coords = farm.boundary.coordinates[0];

                let totalLat = 0;
                let totalLng = 0;

                coords.forEach(([lng, lat]: [number, number]) => {
                    totalLat += lat;
                    totalLng += lng;
                });

                const centerLat = totalLat / coords.length;
                const centerLng = totalLng / coords.length;

                const data = await iotService.getWeatherByCoords(centerLat, centerLng);

                setWeather(data.current);

            } catch (err) {
                console.error("Weather fetch failed", err);
            }
        };

        fetchWeather();
    }, [farm.id]);

    const getFarmCenter = (): LatLngTuple => {
        if (!farm.boundary?.coordinates?.length) {
            return [20.5937, 78.9629] as LatLngTuple;
        }

        const coords = farm.boundary.coordinates[0];

        let totalLat = 0;
        let totalLng = 0;

        coords.forEach(([lng, lat]: [number, number]) => {
            totalLat += lat;
            totalLng += lng;
        });

        return [
            totalLat / coords.length,
            totalLng / coords.length
        ] as LatLngTuple;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{farm.name}</span>
                    <MapPin className="text-gray-400 h-5 w-5" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600">
                    Location: {farm.boundary?.coordinates?.length ? "Mapped Area" : "Not Specified"}
                </p>

                <p className="text-gray-600">
                    Size: {farm.area_acres ?? "Not Available"} acres
                </p>
                {weather && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-semibold">
                            🌤 {weather.temp}°C
                        </p>
                        <p className="text-xs text-gray-600">
                            Humidity: {weather.humidity}% | Wind: {weather.wind} km/h
                        </p>
                    </div>
                )}
                <div className="mt-4 h-60 w-full rounded overflow-hidden border relative">
                    <MapContainer
                        center={getFarmCenter()}
                        zoom={13}
                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                        zoomControl={false}
                        dragging={false}
                    >
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution='Tiles &copy; Esri'
                        />
                        {/* Render Farm Boundary */}
                        {farm.boundary && farm.boundary.coordinates && farm.boundary.coordinates.length > 0 && (
                            <GeoJSON data={farm.boundary} style={{ color: 'yellow', fillOpacity: 0.1 }} />
                        )}

                        {/* Render NDVI Layer */}
                        {isNdviActive && ndviData && (
                            <GeoJSON data={ndviData.geometry} style={{ color: 'green', fillColor: 'lime', fillOpacity: 0.5, stroke: false }} />
                        )}

                        {/* Render Drone Layer */}
                        {isDroneActive && (
                            <GeoJSON data={farm.boundary} style={{ color: 'red', fillOpacity: 0.2, dashArray: '5, 5' }} />
                        )}
                    </MapContainer>
                </div>
                <div className="mt-2 flex gap-2">
                    <Button
                        variant={isNdviActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => onToggleNdvi(farm)}
                    >
                        NDVI View
                    </Button>
                    <Button
                        variant={isDroneActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => onToggleDrone(farm)}
                    >
                        Drone Map
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
