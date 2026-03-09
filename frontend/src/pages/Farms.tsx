import { useState, useEffect } from "react";
import { farmService } from "@/services/farmService";
import { satelliteService } from "@/services/satelliteService";
import { FarmCard } from "@/components/features/farms/FarmCard";
import { droneService } from "@/services/droneService";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapContainer, TileLayer, Polygon, useMap, FeatureGroup, GeoJSON } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix for leaflet marker icon
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Farms() {
    const [farms, setFarms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newFarm, setNewFarm] = useState({ name: "", location: "", size: "" });
    const [boundary, setBoundary] = useState<any>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // India center
    const [open, setOpen] = useState(false);

    // GIS Layers State
    const [activeFarmId, setActiveFarmId] = useState<string | null>(null);
    const [ndviData, setNdviData] = useState<any>(null);
    const [droneData, setDroneData] = useState<any>(null);
    const [showNdvi, setShowNdvi] = useState(false);
    const [showDrone, setShowDrone] = useState(false);

    useEffect(() => {
        console.log("FARMS STATE:", farms);
    }, [farms]);

    useEffect(() => {
        fetchFarms();
    }, []);

    const fetchFarms = async () => {
        try {
            const data = await farmService.getAllFarms();

            console.log("API RESPONSE:", data);

            setFarms(data?.farms || []);

        } catch (error) {
            console.error("Failed to fetch farms", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFarm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!boundary) {
            toast.error("Please draw farm boundary on map");
            return;
        }

        try {
            const payload = {
                name: newFarm.name,
                location: newFarm.location,
                area_acres: Number(newFarm.size),
                boundary: boundary
            };

            console.log("Sending payload:", payload);

            await farmService.createFarm(payload);

            toast.success("Farm added successfully");

            await fetchFarms();

            // 🔥 Reset form
            setNewFarm({ name: "", location: "", size: "" });
            setBoundary(null);

            // 🔥 CLOSE MODAL
            setOpen(false);

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add farm");
        }
    };

    const _onCreated = (e: any) => {
        const layer = e.layer;
        const geoJson = layer.toGeoJSON();
        setBoundary(geoJson.geometry);
        console.log("Boundary Created:", geoJson.geometry);
    }

    const handleToggleNdvi = async (farm: any) => {
        if (activeFarmId === farm.id && showNdvi) {
            setShowNdvi(false);
        } else {
            setActiveFarmId(farm.id);
            setShowNdvi(true);
            setShowDrone(false);
            try {
                const data = await satelliteService.getNDVI(farm.id);
                setNdviData(data || { geometry: farm.boundary });
            } catch (e) {
                console.error("No NDVI data");
                setNdviData({ geometry: farm.boundary });
            }
        }
    };

    const handleToggleDrone = (farm: any) => {
        if (activeFarmId === farm.id && showDrone) {
            setShowDrone(false);
        } else {
            setActiveFarmId(farm.id);
            setShowDrone(true);
            setShowNdvi(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">My Farms & GIS</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Add Farm
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>Add New Farm Boundary</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                                <form onSubmit={handleAddFarm} className="space-y-4">
                                    <Input
                                        placeholder="Farm Name"
                                        value={newFarm.name}
                                        onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        placeholder="Location"
                                        value={newFarm.location}
                                        onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
                                        required
                                    />
                                    <Input
                                        placeholder="Size (in acres)"
                                        type="number"
                                        value={newFarm.size}
                                        onChange={(e) => setNewFarm({ ...newFarm, size: e.target.value })}
                                        required
                                    />
                                    <Button type="submit" className="w-full">Save Farm</Button>
                                </form>
                                <div className="h-[300px] w-full border rounded">
                                    <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <FeatureGroup>
                                            <EditControl
                                                position='topright'
                                                onCreated={_onCreated}
                                                draw={{
                                                    rectangle: false,
                                                    circle: false,
                                                    circlemarker: false,
                                                    marker: true,
                                                    polyline: false,
                                                    polygon: true
                                                }}
                                            />
                                        </FeatureGroup>
                                    </MapContainer>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {farms.map((farm: any) => (
                        <FarmCard
                            key={farm.id}
                            farm={farm}
                            activeFarmId={activeFarmId}
                            showNdvi={showNdvi}
                            showDrone={showDrone}
                            ndviData={ndviData}
                            onToggleNdvi={handleToggleNdvi}
                            onToggleDrone={handleToggleDrone}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
