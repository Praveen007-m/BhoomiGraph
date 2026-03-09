import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, Info, Download, LineChart, Layers, Map as MapIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useFarmerFarms, useFarmerNDVI } from '../hooks/useFarmer';
import { Skeleton } from "@/components/ui/skeleton";

const NDVI = () => {
    const { data: farms } = useFarmerFarms();
    const [selectedFarmId, setSelectedFarmId] = useState<string>('');
    const [activeLayer, setActiveLayer] = useState<'ndvi' | 'ndre' | 'evi' | 'truecolor'>('ndvi');

    // Auto-select first farm
    React.useEffect(() => {
        if (farms?.length > 0 && !selectedFarmId) {
            setSelectedFarmId(farms[0].id);
        }
    }, [farms]);

    const { data: ndviData, isLoading } = useFarmerNDVI(selectedFarmId);

    const chartData = useMemo(() => {
        if (!ndviData?.historical_trend) return [];
        return ndviData.historical_trend.map((val: number, idx: number) => ({
            name: ndviData.labels[idx],
            [activeLayer]: val // Dynamic key based on active layer
        }));
    }, [ndviData]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">NDVI & Crop Health</h1>
                    <p className="text-slate-500 font-medium">Precision satellite monitoring for your fields.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
                        <SelectTrigger className="w-[200px] rounded-xl border-slate-200 font-bold">
                            <SelectValue placeholder="Select Farm" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                            {farms?.map((f: any) => (
                                <SelectItem key={f.id} value={f.id} className="font-medium text-slate-700">{f.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="rounded-xl font-bold gap-2 border-slate-200">
                        <Download size={18} />
                        Export Data
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* NDVI Map Section */}
                <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/50">
                        <div>
                            <CardTitle className="text-lg font-bold">Satellite Heatmap</CardTitle>
                            <CardDescription>Visualizing vegetation density via Sentinel-2</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-none px-3 py-1 font-bold uppercase">{activeLayer}</Badge>
                    </CardHeader>
                    <div className="flex bg-slate-100 p-2 gap-2 border-b border-slate-200">
                        {['ndvi', 'ndre', 'evi', 'truecolor'].map((layer) => (
                            <Button
                                key={layer}
                                variant={activeLayer === layer ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setActiveLayer(layer as any)}
                                className="rounded-lg font-bold text-xs uppercase"
                            >
                                {layer}
                            </Button>
                        ))}
                    </div>
                    <CardContent className="p-0 relative flex-1 min-h-[450px]">
                        {isLoading ? (
                            <Skeleton className="w-full h-full rounded-none" />
                        ) : (
                            <div className="absolute inset-0 bg-slate-100">
                                <img
                                    src={ndviData?.image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200"}
                                    alt="NDVI Thermal"
                                    className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-yellow-500/10 to-red-500/20"></div>

                                {/* Status Overlay */}
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 w-48">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">{activeLayer} Value</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-slate-900">
                                                {activeLayer === 'ndvi' ? (ndviData?.current_ndvi || 0.75) :
                                                    activeLayer === 'ndre' ? (ndviData?.current_ndre || 0.62) :
                                                        activeLayer === 'evi' ? (ndviData?.current_evi || 0.45) : 'N/A'}
                                            </span>
                                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Optimal</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Legend */}
                                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Health Range</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-32 bg-gradient-to-r from-red-500 via-yellow-400 to-green-600 rounded-full"></div>
                                        <div className="flex justify-between text-[10px] font-bold text-slate-500 w-32 absolute top-10">
                                            <span>Low</span>
                                            <span>Stress</span>
                                            <span>High</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Analysis Side Panel */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-gradient-to-br from-green-600 to-green-800 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Leaf size={20} className="text-green-300" />
                                Health Insight
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                <p className="text-sm font-medium leading-relaxed">
                                    The biomass density in the central quadrant has increased by 12% over the last 15 days, indicating healthy crop maturity.
                                </p>
                            </div>
                            <Button variant="ghost" className="w-full text-white hover:bg-white/10 font-bold gap-2">
                                <Layers size={16} />
                                Compare with DSM
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <LineChart size={20} className="text-blue-600" />
                                Vegetation Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full mt-2">
                                {isLoading ? (
                                    <Skeleton className="w-full h-full rounded-xl" />
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                                            />
                                            <YAxis hide domain={[0, 1]} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="ndvi"
                                                stroke="#22c55e"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#ndviGrad)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NDVI;
