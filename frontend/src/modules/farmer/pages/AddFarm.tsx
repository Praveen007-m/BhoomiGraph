import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, MapPin, Ruler, ChevronLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import FarmMap from '../components/FarmMap';
import api from '@/services/api';

const AddFarm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        area_acres: '',
        crop_type: '',
    });
    const [boundary, setBoundary] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!boundary) {
            toast.error("Please draw the farm boundary on the map.");
            return;
        }

        setLoading(true);
        try {
            await api.post('/farmer/farms', {
                ...formData,
                boundary: boundary.geometry,
                area_acres: parseFloat(formData.area_acres) || 0
            });
            toast.success("Farm registered successfully!");
            navigate('/farmer/farms');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to register farm");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/farmer/farms')} className="rounded-full">
                    <ChevronLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Register New Farm</h1>
                    <p className="text-slate-500 text-sm font-medium">Add land plot and define its boundaries.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Sprout className="text-green-600" size={20} />
                            Farm Details
                        </CardTitle>
                        <CardDescription>Enter basic information about your land.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                        <div className="space-y-2">
                            <Label htmlFor="name">Farm Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. North Valley Farm"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">General Location</Label>
                            <Input
                                id="location"
                                placeholder="Village, Taluk, District"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="area">Area (Acres)</Label>
                                <Input
                                    id="area"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    value={formData.area_acres}
                                    onChange={(e) => setFormData({ ...formData, area_acres: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="crop">Primary Crop</Label>
                                <Input
                                    id="crop"
                                    placeholder="e.g. Paddy"
                                    value={formData.crop_type}
                                    onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <MapPin className="text-green-600" size={20} />
                            Draw Boundary
                        </CardTitle>
                        <CardDescription>Use polygon tool to draw plot boundary.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col min-h-[400px]">
                        <FarmMap onBoundaryChange={setBoundary} />
                        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="flex gap-3 text-xs text-green-700 font-medium">
                                <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center shrink-0">1</div>
                                <p>Locate your farm plot on the map.</p>
                            </div>
                            <div className="flex gap-3 text-xs text-green-700 font-medium mt-2">
                                <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center shrink-0">2</div>
                                <p>Select polygon tool and click around plot corners.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <Button variant="outline" type="button" onClick={() => navigate('/farmer/farms')} className="rounded-xl font-bold border-slate-200">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="rounded-xl font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 gap-2 min-w-[140px]">
                        {loading ? 'Registering...' : (
                            <>
                                <Save size={18} />
                                Save Farm Plot
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddFarm;
