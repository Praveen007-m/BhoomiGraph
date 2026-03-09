import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    CheckCircle2,
    Clock,
    ChevronRight,
    MapPin,
    Calendar,
    ArrowUpRight,
    ClipboardList
} from 'lucide-react';
import { usePilotDashboard } from '../hooks/usePilotBookings';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const PilotDashboard = () => {
    const { data, isLoading } = usePilotDashboard();
    const navigate = useNavigate();

    const stats = [
        {
            label: 'Upcoming Missions',
            count: data?.stats?.confirmed || 0,
            icon: Calendar,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            label: 'In Progress',
            count: data?.stats?.['in-progress'] || 0,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-100'
        },
        {
            label: 'Completed',
            count: data?.stats?.completed || 0,
            icon: CheckCircle2,
            color: 'text-green-600',
            bg: 'bg-green-100'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pilot Dashboard</h1>
                <p className="text-slate-500 font-medium">Manage your survey assignments and deliverables.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)
                ) : (
                    stats.map((stat) => (
                        <Card key={stat.label} className="border-slate-200 shadow-sm rounded-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={20} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.count}</h3>
                                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Next Mission Card */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="p-6 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Next Assignment</CardTitle>
                                <CardDescription className="text-sm">Details of your next scheduled flight</CardDescription>
                            </div>
                            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                                <ClipboardList size={20} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {isLoading ? (
                            <Skeleton className="h-32 w-full" />
                        ) : data?.latestMission ? (
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-bold text-slate-900">{data.latestMission.farm?.name}</h4>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <MapPin size={16} />
                                            <span>{data.latestMission.farm?.location || 'Target Sector'}</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 inline-flex items-center gap-2 text-slate-900 font-bold self-start">
                                        <Calendar size={16} className="text-primary" />
                                        {data.latestMission.booking_date ? format(new Date(data.latestMission.booking_date), 'dd MMM yyyy') : 'N/A'}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <Button
                                        onClick={() => navigate(`/pilot/bookings/${data.latestMission.id}`)}
                                        className="rounded-xl px-6 font-bold"
                                    >
                                        View Details
                                        <ChevronRight size={16} className="ml-2" />
                                    </Button>
                                    <Button variant="outline" className="rounded-xl px-6 font-bold" onClick={() => navigate('/pilot/jobs')}>
                                        All Bookings
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-sm font-medium text-slate-500">No pending assignments found.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Status Help Card */}
                <Card className="border-slate-200 shadow-sm rounded-xl bg-primary/5">
                    <CardHeader className="p-6">
                        <CardTitle className="text-lg font-bold text-slate-900">Operational Notice</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Ensure all survey data is uploaded promptly after flight completion. Accepted formats include <span className="font-bold">GeoTIFF, Shapefiles</span>, and <span className="font-bold">PDF Reports</span>.
                        </p>
                        <div className="p-4 bg-white/50 rounded-lg border border-primary/10">
                            <p className="text-xs font-bold text-primary uppercase mb-1">Upload Limit</p>
                            <p className="text-sm font-medium text-slate-900">100MB per dataset</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PilotDashboard;
