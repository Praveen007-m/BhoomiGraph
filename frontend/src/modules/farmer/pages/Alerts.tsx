import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Bell,
    Sprout,
    ShieldAlert,
    Wallet,
    CheckCircle2,
    MoreHorizontal,
    Trash2,
    CheckCheck,
    Calendar
} from 'lucide-react';
import { useFarmerAlerts } from '../hooks/useFarmer';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import api from '@/services/api';

const Alerts = () => {
    const { data: alerts, isLoading, refetch } = useFarmerAlerts();

    const getIcon = (type: string) => {
        switch (type) {
            case 'agronomy': return Sprout;
            case 'booking': return ShieldAlert;
            case 'wallet': return Wallet;
            default: return Bell;
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case 'agronomy': return 'bg-green-50 text-green-600 border-green-100';
            case 'booking': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'wallet': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/farmer/alerts/${id}/read`);
            refetch();
        } catch (error) {
            console.error("Failed to mark alert as read", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Alert Center</h1>
                    <p className="text-slate-500 font-medium">Important notifications regarding your farm and services.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="font-bold text-slate-500 gap-2 h-10 px-4 rounded-xl hover:bg-slate-100">
                        <CheckCheck size={18} />
                        Mark all read
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl border-slate-200">
                        <MoreHorizontal size={18} />
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl w-full" />)
                ) : alerts?.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">All caught up!</h3>
                        <p className="text-sm text-slate-400 font-medium">No new alerts at the moment.</p>
                    </div>
                ) : (
                    alerts?.map((alert: any) => {
                        const Icon = getIcon(alert.type);
                        const style = getColors(alert.type);
                        return (
                            <Card
                                key={alert.id}
                                className={cn(
                                    "border-none shadow-sm transition-all duration-300 rounded-3xl overflow-hidden group",
                                    !alert.is_read ? "bg-white ring-1 ring-slate-100 shadow-md" : "bg-slate-50/50 opacity-75"
                                )}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-5">
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border", style)}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className={cn("text-base font-black truncate", !alert.is_read ? "text-slate-900" : "text-slate-600")}>
                                                        {alert.title}
                                                    </h3>
                                                    {!alert.is_read && (
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-200"></div>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    {format(new Date(alert.createdAt), 'dd MMM, HH:mm')}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-4">
                                                {alert.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <Badge className={cn("px-3 py-0.5 rounded-lg border-none capitalize font-bold text-[10px]", style)}>
                                                    {alert.type}
                                                </Badge>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!alert.is_read && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50"
                                                            onClick={() => markAsRead(alert.id)}
                                                        >
                                                            Mark Read
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-bold text-red-400 hover:bg-red-50 hover:text-red-500">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Alerts;
