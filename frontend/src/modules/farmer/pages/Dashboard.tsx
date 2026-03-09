import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Map as MapIcon,
    Activity,
    Calendar,
    Wallet,
    Plus,
    ArrowUpRight,
    TrendingUp,
    Leaf
} from 'lucide-react';
import { useFarmerDashboard } from '../hooks/useFarmer';
import StatCard from '../../admin/components/StatCard';
import ChartCard from '../../admin/components/ChartCard';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWallet } from '@/contexts/WalletContext';

const Dashboard = () => {
    const { data: stats, isLoading } = useFarmerDashboard();
    const navigate = useNavigate();
    const { balance } = useWallet();

    const kpiCards = [
        {
            title: 'My Farms',
            value: stats?.totalFarms || 0,
            icon: MapIcon,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            title: 'Active Sensors',
            value: stats?.activeSensors || 0,
            icon: Activity,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Upcoming Bookings',
            value: stats?.upcomingBookings || 0,
            icon: Calendar,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        {
            title: 'Wallet Balance',
            value: `₹${balance.toLocaleString()}`,
            icon: Wallet,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Farmer Dashboard</h1>
                    <p className="text-slate-500 font-medium">Monitoring your field performance and vital stats.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                        View Reports
                    </Button>
                    <Button className="rounded-xl font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 gap-2">
                        <Plus size={18} />
                        Register New Farm
                    </Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, idx) => (
                    <Card key={idx} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-3 rounded-2xl", card.bg, card.color)}>
                                    <card.icon size={24} />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    <TrendingUp size={12} />
                                    +12%
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 mb-1">{card.title}</p>
                                <h3 className="text-2xl font-black text-slate-900 leading-none">
                                    {isLoading ? '...' : card.value}
                                </h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Insights Section */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold">Crop Vitality Trend (NDVI)</CardTitle>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Live Sync</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                            {/* Placeholder for real charts later */}
                            <div className="text-center">
                                <Leaf size={48} className="text-green-200 mx-auto mb-3" />
                                <p className="text-sm text-slate-400 font-medium">Satellite data loading for your primary farm...</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Recent Advisory */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Recent Advisory</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {stats?.latestAdvisory ? (
                                <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                                    <p className={cn(
                                        "text-xs font-bold mb-1 uppercase",
                                        stats.latestAdvisory.severity === 'critical' ? 'text-red-400' : 'text-emerald-400'
                                    )}>
                                        {stats.latestAdvisory.category} Advisory
                                    </p>
                                    <p className="text-sm font-medium leading-relaxed mb-3">
                                        {stats.latestAdvisory.title}
                                    </p>
                                    <Button
                                        onClick={() => navigate('/farmer/alerts')}
                                        variant="link"
                                        className="text-emerald-400 p-0 h-auto text-xs font-bold gap-1"
                                    >
                                        View in Alerts <ArrowUpRight size={12} />
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-8 text-center border border-dashed border-white/10 rounded-xl">
                                    <p className="text-xs font-bold text-slate-500 uppercase">No Active Advisories</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Weather Forecast</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { day: 'Today', temp: '32°C', state: 'Sunny' },
                                { day: 'Tomorrow', temp: '34°C', state: 'Clear' },
                                { day: 'Friday', temp: '29°C', state: 'Cloudy' },
                            ].map((w, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 border-slate-100">
                                    <span className="text-sm font-bold text-slate-600">{w.day}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-black text-slate-900">{w.temp}</span>
                                        <span className="text-xs font-bold text-slate-500 uppercase">{w.state}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Internal utility to keep things clean
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default Dashboard;
