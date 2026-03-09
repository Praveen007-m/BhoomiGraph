import React, { useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Marker, Popup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import { useFarmerFarms } from '../hooks/useFarmer';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';

// Fix Leaflet Marker Icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FarmMapProps {
    onBoundaryChange: (geojson: any) => void;
}

const FarmMap: React.FC<FarmMapProps> = ({ onBoundaryChange }) => {
    const [map, setMap] = useState<L.Map | null>(null);
    const [waterResources, setWaterResources] = useState<any[]>([]);

    React.useEffect(() => {
        // Simple fetch for all water resources (in production this would be filtered by farm/bounds)
        axios.get(`${API_URL}/water`, { withCredentials: true })
            .then(res => setWaterResources(res.data.resources))
            .catch(err => console.error('Water error', err));
    }, []);

    const _onCreate = (e: any) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const geojson = layer.toGeoJSON();
            onBoundaryChange(geojson);
        }
    };

    const _onEdited = (e: any) => {
        const { layers } = e;
        layers.eachLayer((layer: any) => {
            const geojson = layer.toGeoJSON();
            onBoundaryChange(geojson);
        });
    };

    const _onDeleted = () => {
        onBoundaryChange(null);
    };

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <MapContainer
                center={[10.7905, 78.7047]} // Trichy, Tamil Nadu center
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
                ref={setMap}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FeatureGroup>
                    <EditControl
                        position='topright'
                        onCreated={_onCreate}
                        onEdited={_onEdited}
                        onDeleted={_onDeleted}
                        draw={{
                            rectangle: false,
                            circle: false,
                            polyline: false,
                            circlemarker: false,
                            marker: false,
                            polygon: {
                                allowIntersection: false,
                                drawError: {
                                    color: '#e1e100',
                                    message: '<strong>Error:</strong> Boundary cannot intersect!'
                                },
                                shapeOptions: {
                                    color: '#16a34a'
                                }
                            }
                        }}
                    />
                </FeatureGroup>

                {/* Water Resources Layer */}
                {waterResources.map((water: any) => (
                    <Marker
                        key={water.id}
                        position={[water.geometry.coordinates[1], water.geometry.coordinates[0]]}
                        icon={L.divIcon({
                            className: 'water-marker',
                            html: `<div class="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-md"></div>`
                        })}
                    >
                        <Popup>
                            <div className="font-bold uppercase text-xs">{water.type}</div>
                            <div className="text-xs text-blue-600 font-bold">Level: {water.water_level}m</div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default FarmMap;
