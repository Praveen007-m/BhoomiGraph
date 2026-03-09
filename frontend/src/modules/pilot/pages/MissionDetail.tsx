import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    usePilotBookingDetails,
    useUpdateMissionStatus,
    useUploadSurvey
} from '../hooks/usePilotBookings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Calendar,
    User,
    Phone,
    Clock,
    ArrowLeft,
    Map as MapIcon,
    AlertCircle,
    CheckCircle2,
    ClipboardCheck,
    Navigation,
    FileCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import UploadZone from '../components/UploadZone';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const MissionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: booking, isLoading } = usePilotBookingDetails(id!);
    const updateStatusMutation = useUpdateMissionStatus();
    const uploadMutation = useUploadSurvey();

    const handleStatusChange = async (newStatus: string) => {
        try {
            await updateStatusMutation.mutateAsync({ id: id!, status: newStatus });
            toast.success(`Booking status updated to ${newStatus}`);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUploadFiles = async (files: File[]) => {
        try {
            // Simulated upload data structure
            const mockData = {
                orthomosaic_url: 'https://bhoomigraph-assets.s3.amazonaws.com/ortho_123.tif',
                preview_url: 'https://bhoomigraph-assets.s3.amazonaws.com/prev_123.jpg',
                report_url: 'https://bhoomigraph-assets.s3.amazonaws.com/rep_123.pdf',
                uploaded_at: new Date()
            };

            await uploadMutation.mutateAsync({ id: id!, data: mockData });
            toast.success("Survey data successfully uploaded.");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (isLoading) return <div className="p-8 space-y-6"><Skeleton className="h-40 w-full rounded-xl" /><Skeleton className="h-80 w-full rounded-xl" /></div>;
    if (!booking) return <div className="p-8 text-center"><h1 className="text-slate-900 text-2xl font-bold">Booking Not Found</h1></div>;

    const statusSteps = [
        { id: 'confirmed', label: 'Pending', icon: ClipboardCheck },
        { id: 'in-progress', label: 'In-progress', icon: Navigation },
        { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate('/pilot/jobs')}
                        className="w-10 h-10 rounded-lg border-slate-200"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Booking Details</h1>
                        <p className="text-slate-500 font-medium text-xs mt-0.5">Reference: #{booking.id.slice(0, 8)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200">
                    {statusSteps.map((step) => {
                        const statusOrder = ['confirmed', 'in-progress', 'completed'];
                        const isPast = statusOrder.indexOf(booking.status) >= statusOrder.indexOf(step.id);
                        const isCurrent = booking.status === step.id;
                        return (
                            <div key={step.id} className="flex items-center">
                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all",
                                    isCurrent ? "bg-primary text-white shadow-sm" : isPast ? "text-primary bg-primary/5" : "text-slate-400"
                                )}>
                                    <step.icon size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{step.label}</span>
                                </div>
                                {step.id !== 'completed' && <div className="w-4 h-px bg-slate-100 mx-1" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Booking Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Visual Segment */}
                    <Card className="border-slate-200 rounded-2xl overflow-hidden shadow-sm min-h-[350px] relative">
                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200"
                                className="w-full h-full object-cover opacity-60"
                                alt="Farm Map"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />

                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-lg">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Target Farm</p>
                                    <p className="text-lg font-extrabold text-slate-900">{booking.farm?.name}</p>
                                    <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                                        <MapPin size={12} />
                                        <span className="text-xs font-medium">{booking.farm?.location || 'Aerial Survey'}</span>
                                    </div>
                                </div>

                                <div className="bg-primary p-3 rounded-xl shadow-lg">
                                    <MapIcon className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Details Card */}
                    <Card className="border-slate-200 rounded-2xl shadow-sm">
                        <CardHeader className="px-6 py-4 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold text-slate-900">Assignment Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-primary border border-slate-100 shrink-0">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scheduled Date</p>
                                        <p className="text-base font-bold text-slate-900 mt-0.5">
                                            {format(new Date(booking.booking_date), 'EEEE, dd MMM yyyy')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-primary border border-slate-100 shrink-0">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Farmer</p>
                                        <p className="text-base font-bold text-slate-900 mt-0.5">{booking.user?.name}</p>
                                        <p className="text-xs font-medium text-slate-500">{booking.user?.mobile}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-primary border border-slate-100 shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Type</p>
                                        <p className="text-base font-bold text-slate-900 mt-0.5">{booking.service_type}</p>
                                        <p className="text-xs font-medium text-primary">Drone Survey Operations</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary border border-primary/10 shrink-0">
                                        <FileCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Status</p>
                                        <p className="text-base font-bold text-green-600 mt-0.5">Success</p>
                                        <p className="text-xs font-medium text-slate-500">Billable to Wallet</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Actions */}
                <div className="space-y-8">
                    {/* Status Update */}
                    <Card className="border-slate-200 rounded-2xl shadow-sm">
                        <CardHeader className="px-6 py-4">
                            <CardTitle className="text-base font-bold text-slate-900">Update Status</CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 space-y-4">
                            <Select onValueChange={handleStatusChange} defaultValue={booking.status}>
                                <SelectTrigger className="h-11 rounded-lg border-slate-200 text-slate-900 font-medium">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200">
                                    <SelectItem value="confirmed">Pending</SelectItem>
                                    <SelectItem value="in-progress">In-progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 flex gap-3">
                                <AlertCircle size={16} className="text-primary shrink-0" />
                                <p className="text-[10px] font-medium text-primary leading-tight">
                                    Updating to <span className="font-bold">Completed</span> will release reports to the farmer and finalize the task.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upload Management */}
                    <Card className="border-slate-200 rounded-2xl shadow-sm overflow-hidden relative">
                        <CardHeader className="px-6 py-4 border-b border-slate-100">
                            <CardTitle className="text-base font-bold text-slate-900">Survey Data</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {booking.DroneSurvey ? (
                                <div className="space-y-6">
                                    <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">Data Uploaded</h4>
                                            <p className="text-[10px] font-medium text-green-600 uppercase mt-0.5">Validated and stored</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {[
                                            { name: 'Orthomosaic.tif', size: '42.5 MB' },
                                            { name: 'Survey_Report.pdf', size: '1.2 MB' }
                                        ].map(file => (
                                            <div key={file.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <p className="text-xs font-bold text-slate-700">{file.name}</p>
                                                <Badge variant="secondary" className="text-[8px] font-bold bg-white text-slate-500">{file.size}</Badge>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full h-10 rounded-lg border-slate-200 text-slate-600 font-bold"
                                        onClick={() => handleUploadFiles([])}
                                    >
                                        Update Files
                                    </Button>
                                </div>
                            ) : (
                                <UploadZone onUpload={handleUploadFiles} isUploading={uploadMutation.isPending} />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MissionDetail;
