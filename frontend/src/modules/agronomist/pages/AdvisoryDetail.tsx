import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdvisoryDetails, useUpdateAdvisory } from '../hooks/useAdvisories';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Calendar,
    User,
    MapPin,
    CheckCircle2,
    Activity,
    Database,
    ExternalLink,
    FileText,
    TrendingUp,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const AdvisoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: advisory, isLoading } = useAdvisoryDetails(id!);
    const updateMutation = useUpdateAdvisory();

    const handleResolve = async () => {
        try {
            await updateMutation.mutateAsync({ id: id!, data: { status: 'resolved' } });
            toast.success("Advisory marked as resolved.");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (isLoading) return (
        <div className="space-y-8">
            <Skeleton className="h-20 w-full rounded-2xl bg-gray-100" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="lg:col-span-2 h-[500px] rounded-2xl bg-gray-100" />
                <Skeleton className="h-[500px] rounded-2xl bg-gray-100" />
            </div>
        </div>
    );

    if (!advisory) return (
        <div className="py-20 text-center">
            <AlertCircle size={48} className="text-gray-200 mx-auto mb-4" />
            <h1 className="text-gray-900 text-2xl font-bold">Advisory Not Found</h1>
            <Button onClick={() => navigate('/agronomist/advisories')} variant="link" className="mt-2 text-primary">Return to Registry</Button>
        </div>
    );

    const severityColors: any = {
        low: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        medium: 'bg-amber-50 text-amber-600 border-amber-100',
        high: 'bg-orange-50 text-orange-600 border-orange-100',
        critical: 'bg-red-50 text-red-600 border-red-100 font-bold'
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/agronomist/advisories')}
                        className="w-11 h-11 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{advisory.title}</h1>
                            <Badge className={cn("px-3 py-1 font-bold uppercase tracking-wider rounded-lg text-[10px] border shadow-none", severityColors[advisory.severity])}>
                                {advisory.severity}
                            </Badge>
                        </div>
                        <p className="text-gray-500 font-medium text-sm mt-1">
                            Report ID: #{advisory.id.slice(0, 8)} | Published: {format(new Date(advisory.createdAt), 'dd MMM yyyy')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {advisory.status !== 'resolved' && (
                        <Button
                            onClick={handleResolve}
                            className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 font-semibold gap-2 shadow-sm transition-all"
                        >
                            <CheckCircle2 size={18} />
                            Mark as Resolved
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Scientific Analysis */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Analysis Content */}
                    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <CardHeader className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="text-primary" size={20} />
                                Diagnostic Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Issue Analysis</h3>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 min-h-[100px]">
                                    <p className="text-gray-700 font-medium leading-relaxed">{advisory.issue_analysis}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-primary uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <TrendingUp size={14} />
                                    Recommendations
                                </h3>
                                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 border-l-4 border-l-primary min-h-[100px]">
                                    <p className="text-gray-900 font-semibold leading-relaxed">{advisory.recommendations}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Telemetry Snapshot */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
                            <CardHeader className="px-6 py-4 border-b border-gray-50">
                                <CardTitle className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="text-amber-500" size={16} />
                                    Ground Telemetry
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {advisory.farm?.iot_devices?.[0] ? (
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{advisory.farm.iot_devices[0].name}</p>
                                                <p className="text-[11px] text-gray-400 font-medium">{advisory.farm.iot_devices[0].type}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-amber-600">Active</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Status</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-medium text-gray-400 italic text-center py-4">No ground telemetry available</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
                            <CardHeader className="px-6 py-4 border-b border-gray-50">
                                <CardTitle className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="text-blue-500" size={16} />
                                    Farm Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-700">Farm: <span className="text-gray-900 font-bold">{advisory.farm?.name}</span></p>
                                    <p className="text-xs text-gray-500 font-medium truncate">{advisory.farm?.location || 'Location data unavailable'}</p>
                                    <Button variant="link" className="p-0 h-auto text-primary text-xs font-bold uppercase mt-4">
                                        View Precision Map <ExternalLink size={12} className="ml-1" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right: Metadata & History */}
                <div className="space-y-8">
                    {/* Entity Profiles */}
                    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
                        <CardHeader className="px-6 py-4 border-b border-gray-50">
                            <CardTitle className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Stakeholders</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Farmer</p>
                                    <p className="text-base font-bold text-gray-900">{advisory.farm?.user?.name || 'Client'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Agronomist</p>
                                    <p className="text-base font-bold text-gray-900">{advisory.agronomist?.name || 'Specialist'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
                        <CardHeader className="px-6 py-4 border-b border-gray-50">
                            <CardTitle className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status Lifecycle</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-2 space-y-6">
                            <div className="flex gap-4 relative">
                                <div className="absolute left-[7px] top-6 w-[1px] h-[calc(100%-24px)] bg-gray-100" />
                                <div className="w-4 h-4 rounded-full bg-primary border-4 border-white z-10 shadow-sm" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900 uppercase">Published</p>
                                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">{format(new Date(advisory.createdAt), 'dd MMM yyyy HH:mm')}</p>
                                </div>
                            </div>

                            {advisory.status === 'resolved' && (
                                <div className="flex gap-4 relative">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-white z-10 shadow-sm" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-900 uppercase">Resolved</p>
                                        <p className="text-[10px] font-medium text-gray-400 mt-0.5">{format(new Date(advisory.updatedAt), 'dd MMM yyyy HH:mm')}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdvisoryDetail;
