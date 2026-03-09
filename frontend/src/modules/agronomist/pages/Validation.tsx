import React, { useState } from 'react';
import { useValidationFarms } from '../hooks/useAgronomist';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    User,
    Calendar,
    ArrowRight,
    Map as MapIcon,
    Ruler,
    Loader2,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ValidationPage = () => {
    const { data: farms, isLoading } = useValidationFarms();
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        setProcessingId(id);
        // This will call the API to update farm status
        setTimeout(() => {
            setProcessingId(null);
            toast.success(`Farm ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        }, 1500);
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-emerald-600" /></div>;

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-black text-emerald-950 tracking-tight">Farm Validation</h1>
                <p className="text-slate-500 font-medium">Verify boundary accuracy and applicant eligibility.</p>
            </div>

            <div className="space-y-6">
                {farms?.length === 0 ? (
                    <Card className="border-none shadow-sm p-20 text-center">
                        <CheckCircle size={64} className="text-emerald-100 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-emerald-950">Queue Empty</h3>
                        <p className="text-slate-500">All currently registered farms have been validated.</p>
                    </Card>
                ) : (
                    farms?.map((farm: any) => (
                        <Card key={farm.id} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-emerald-50">
                                    {/* Geographic Info */}
                                    <div className="lg:w-1/3 p-8 bg-emerald-50/20">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">
                                            <MapIcon size={14} />
                                            Boundary Data
                                        </div>
                                        <div className="w-full aspect-video rounded-2xl bg-emerald-100 border-2 border-emerald-50 border-dashed flex flex-col items-center justify-center text-emerald-300">
                                            <Ruler size={32} />
                                            <span className="text-[10px] font-bold mt-2 tracking-tighter">GeoJSON Overlay</span>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between font-bold text-sm text-emerald-900">
                                            <span>Calculated Area</span>
                                            <span>{farm.area_acres} Acres</span>
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="flex-1 p-8">
                                        <div className="flex flex-col h-full justify-between">
                                            <div>
                                                <div className="flex items-center pointer-events-none mb-1">
                                                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 font-bold text-[10px]">PENDING REVIEW</Badge>
                                                </div>
                                                <h3 className="text-2xl font-black text-emerald-950 mb-4">{farm.name}</h3>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                                            <User size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase">Owner</p>
                                                            <p className="text-sm font-bold text-slate-700">{farm.user?.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                                            <MapPin size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase">Location</p>
                                                            <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{farm.location || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                                                <Button
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold gap-2"
                                                    disabled={!!processingId}
                                                    onClick={() => handleAction(farm.id, 'approve')}
                                                >
                                                    {processingId === farm.id ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                                                    Confirm Boundary
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="flex-1 text-red-600 hover:bg-red-50 rounded-xl font-bold gap-2"
                                                    disabled={!!processingId}
                                                    onClick={() => handleAction(farm.id, 'reject')}
                                                >
                                                    <XCircle size={18} />
                                                    Flag for Correction
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ValidationPage;
