import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmerFarms } from '../hooks/useFarmer';
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Ruler, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Farms = () => {
    const navigate = useNavigate();
    const { data: farms, isLoading } = useFarmerFarms();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Farms</h1>
                    <p className="text-slate-500 font-medium">Manage and monitor all your registered land plots.</p>
                </div>
                <Button
                    onClick={() => navigate('/farmer/farms/add')}
                    className="rounded-xl font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 gap-2"
                >
                    <Plus size={18} />
                    Register New Farm
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {farms?.map((farm: any) => (
                        <Card key={farm.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
                            <div className="h-32 bg-slate-200 relative overflow-hidden">
                                {/* Map Preview Placeholder */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                                    <MapPin size={32} className="text-green-300 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div className="absolute top-4 right-4">
                                    <Badge className={cn(
                                        "rounded-full font-bold",
                                        farm.status === 'approved' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                    )}>
                                        {farm.status === 'approved' ? <CheckCircle2 size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                                        {farm.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{farm.name}</h3>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                        <MapPin size={14} className="text-slate-400" />
                                        {farm.location || 'Location not specified'}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                        <Ruler size={14} className="text-slate-400" />
                                        {farm.area_acres || 0} Acres • {farm.crop_type || 'Unknown Crop'}
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full rounded-xl font-bold border-slate-200 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all">
                                    Open Digital Twin
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default Farms;
