import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    FileText,
    ArrowUpRight,
    Search,
    Sprout
} from 'lucide-react';
import { useAgronomistDashboard } from '../hooks/useAdvisories';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";

const AgronomistDashboard = () => {
    const { data, isLoading } = useAgronomistDashboard();
    const navigate = useNavigate();

    const stats = [
        {
            label: 'Total Farms',
            count: data?.farmsToReview || 0,
            icon: Sprout,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Draft Advisories',
            count: data?.stats?.draft || 0,
            icon: FileText,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            label: 'Published Advisories',
            count: data?.stats?.published || 0,
            icon: CheckCircle2,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Critical Alerts',
            count: data?.criticalAlerts || 0,
            icon: AlertCircle,
            color: 'text-red-600',
            bg: 'bg-red-50'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Agronomist Dashboard</h1>
                    <p className="text-gray-500 font-medium">Monitoring crop health and managing advisories</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => navigate('/agronomist/farms')}
                        className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 font-semibold gap-2 shadow-sm"
                    >
                        <Search size={18} />
                        Analyze Farms
                    </Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl bg-gray-100" />)
                ) : (
                    stats.map((stat) => (
                        <Card key={stat.label} className="border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-all group overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                                        <stat.icon size={20} />
                                    </div>
                                    <ArrowUpRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{stat.count}</h3>
                                    <p className="text-sm font-medium text-gray-500 mt-0.5">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Validation Queue Card */}
                <Card className="lg:col-span-2 border-gray-200 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="px-8 py-6 border-b border-gray-100 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold text-gray-900">Validation Queue</CardTitle>
                            <CardDescription>Farms requiring scientific review</CardDescription>
                        </div>
                        {!isLoading && data?.farmsToReview > 0 && (
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {data.farmsToReview} Pending
                            </span>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-8 space-y-4">
                                <Skeleton className="h-12 w-full bg-gray-50" />
                                <Skeleton className="h-12 w-full bg-gray-50" />
                            </div>
                        ) : data?.farmsToReview > 0 ? (
                            <div className="p-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-emerald-600">
                                    <Sprout size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">Farms Need Review</h4>
                                <p className="text-gray-500 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                                    There are {data.farmsToReview} farms currently awaiting agronomy validation based on recent satellite and drone data.
                                </p>
                                <Button
                                    onClick={() => navigate('/agronomist/farms')}
                                    variant="outline"
                                    className="border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold rounded-xl h-10 px-6 mt-2"
                                >
                                    View Farm Registry
                                </Button>
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <CheckCircle2 size={48} className="text-gray-100 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium">All clear! No current pending validations.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Critical Alerts Card */}
                <Card className="border-red-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="px-8 py-6 border-b border-red-50 bg-red-50/30 flex flex-row items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100 text-red-600">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-gray-900">Critical Alerts</CardTitle>
                            <CardDescription className="text-red-600/70">Requires attention</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full bg-gray-50" />
                            </div>
                        ) : data?.criticalAlerts > 0 ? (
                            <div className="space-y-6">
                                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                    You have <span className="text-red-600 font-bold">{data.criticalAlerts}</span> active critical advisories that haven't been resolved yet.
                                </p>
                                <Button
                                    variant="link"
                                    onClick={() => navigate('/agronomist/advisories')}
                                    className="p-0 h-auto font-bold text-red-600 text-sm hover:no-underline flex items-center gap-2 group"
                                >
                                    Manage Alerts
                                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-sm font-medium text-gray-400 italic">No critical outbreaks detected.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AgronomistDashboard;
