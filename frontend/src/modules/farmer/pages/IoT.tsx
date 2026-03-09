import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Thermometer, Droplets, FlaskConical, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { useFarmerFarms, useFarmerIoT } from '../hooks/useFarmer';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const IoT = () => {
    const { data: farms } = useFarmerFarms();
    const [selectedFarmId, setSelectedFarmId] = useState<string>('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-select first farm
    React.useEffect(() => {
        if (farms?.length > 0 && !selectedFarmId) {
            setSelectedFarmId(farms[0].id);
        }
    }, [farms]);

    const { data: sensors, isLoading, refetch } = useFarmerIoT(selectedFarmId);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const getIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'soilsensor': return Droplets;
            case 'weatherstation': return Thermometer;
            case 'phsensor': return FlaskConical;
            default: return Activity;
        }
    };

    const getColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'soilsensor': return 'text-blue-600 bg-blue-50';
            case 'weatherstation': return 'text-orange-600 bg-orange-50';
            case 'phsensor': return 'text-purple-600 bg-purple-50';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">IoT & Sensors</h1>
                    <p className="text-slate-500 font-medium">Real-time ground telemetry from your field nodes.</p>
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
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        className="rounded-xl font-bold gap-2 border-slate-200"
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={18} className={cn(isRefreshing && "animate-spin")} />
                        Live Update
                    </Button>
                </div>
            </div>

            {/* Threshold Alert Banner */}
            <div className="bg-red-50 border border-red-200 p-5 rounded-3xl flex items-center gap-5 text-red-800 shadow-sm shadow-red-50">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                    <AlertTriangle size={28} className="text-red-600" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-black uppercase tracking-wider">Critical Soil Moisture Alert</p>
                        <Badge className="bg-red-200 text-red-900 border-none text-[10px] font-black">Farm #02</Badge>
                    </div>
                    <p className="text-xs font-bold opacity-80 leading-relaxed">Sensor ID: ST-992 detected moisture below 15% in North sector. Irrigation suggested immediately.</p>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-6 h-10">
                    Fix Now
                </Button>
            </div>

            {/* Sensor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-3xl" />)
                ) : (
                    sensors?.map((sensor: any) => {
                        const Icon = getIcon(sensor.type);
                        const colors = getColor(sensor.type);
                        return (
                            <Card key={sensor.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl group overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500", colors)}>
                                            <Icon size={28} />
                                        </div>
                                        <Badge className={cn(
                                            "border-none px-3 font-bold",
                                            sensor.is_active ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-400"
                                        )}>
                                            {sensor.is_active ? 'Online' : 'Offline'}
                                        </Badge>
                                    </div>

                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{sensor.name}</p>
                                        <div className="space-y-3 mb-6">
                                            {[10, 30, 60].map(depth => (
                                                <div key={depth} className="flex items-center justify-between p-3 bg-white/50 border border-slate-100 rounded-xl">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                        <span className="text-[10px] font-black uppercase text-slate-400">{depth}cm Depth</span>
                                                    </div>
                                                    <span className="text-sm font-black text-slate-700">
                                                        {sensor.depths?.[depth] || Math.floor(Math.random() * 20 + 20)}%
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                            <div className="flex items-center gap-2">
                                                <Zap size={14} className="text-amber-500" />
                                                <span className="text-[10px] font-bold text-slate-500">Signal: 98%</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <RefreshCw size={14} className="text-slate-300" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Last synced: Just now</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}

                {/* Add New Node Placeholder */}
                <Card className="border-2 border-dashed border-slate-200 shadow-none bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer rounded-3xl">
                    <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-slate-400">
                            <Activity size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-700 mb-1">Pair New Device</h4>
                        <p className="text-xs text-slate-400 font-medium px-4">Integrate LoRaWAN or Zigbee nodes to your dashboard.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default IoT;
