import React from 'react';
import { usePilotJobs, useUpdateJobStatus } from '../hooks/usePilot';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Calendar,
    User,
    ExternalLink,
    ChevronRight,
    Loader2,
    CheckCircle2,
    Clock,
    Play
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { toast } from 'sonner';

const JobsPage = () => {
    const { data: jobs, isLoading } = usePilotJobs();
    const updateJob = useUpdateJobStatus();

    const handleStatusUpdate = (id: string, currentStatus: string) => {
        let nextStatus = 'in-progress';
        if (currentStatus === 'in-progress') nextStatus = 'completed';

        updateJob.mutate({ id, status: nextStatus }, {
            onSuccess: () => toast.success(`Mission status updated to ${nextStatus}`),
            onError: () => toast.error('Status update failed')
        });
    };

    if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Active Assignments</h1>
                <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-xs">Current Sector Operations</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {jobs?.map((job: any) => (
                    <Card key={job.id} className="bg-slate-900 border-slate-800 shadow-2xl overflow-hidden group">
                        <div className="flex flex-col lg:flex-row h-full">
                            {/* Mission Info Left */}
                            <div className="flex-1 p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <Badge className={cn(
                                        "px-3 py-1 rounded-full font-black text-[10px] tracking-widest uppercase",
                                        job.status === 'completed' ? "bg-green-500/10 text-green-400" :
                                            job.status === 'in-progress' ? "bg-blue-500/10 text-blue-400 animate-pulse" :
                                                "bg-orange-500/10 text-orange-400"
                                    )}>
                                        ● {job.status}
                                    </Badge>
                                    <span className="text-slate-500 font-mono text-xs uppercase tracking-tighter">REF: {job.id.slice(0, 8)}</span>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-white leading-tight mb-2 group-hover:text-blue-400 transition-colors">{job.service_type}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                                        <MapPin size={16} className="text-blue-500" />
                                        {job.farm?.name}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Scheduled</p>
                                        <p className="text-sm font-bold text-white flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> {format(new Date(job.booking_date), 'dd MMM yyyy')}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Farmer Contact</p>
                                        <p className="text-sm font-bold text-white flex items-center justify-end gap-2">{job.user?.name} <User size={14} className="text-blue-500" /></p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {job.status !== 'completed' && (
                                        <Button
                                            className="flex-1 h-12 rounded-xl font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-900/40 gap-3 text-sm"
                                            onClick={() => handleStatusUpdate(job.id, job.status)}
                                            disabled={updateJob.isPending}
                                        >
                                            {updateJob.isPending ? <Loader2 className="animate-spin" size={18} /> :
                                                job.status === 'in-progress' ? <><CheckCircle2 size={18} /> Finish Mission</> :
                                                    <><Play size={18} /> Begin Flight</>
                                            }
                                        </Button>
                                    )}
                                    <Button variant="ghost" className="w-12 h-12 p-0 rounded-xl bg-slate-800 text-white hover:bg-slate-700">
                                        <ExternalLink size={20} />
                                    </Button>
                                </div>
                            </div>

                            {/* Mission Map Right (Placeholder) */}
                            <div className="w-full lg:w-48 bg-slate-800/50 flex items-center justify-center p-4">
                                <div className="w-full aspect-square border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-600 gap-2">
                                    <MapPin size={24} />
                                    <span className="text-[10px] font-black uppercase">GPS Lock</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default JobsPage;
