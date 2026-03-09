import React from 'react';
import {
    Users, Tractor, Activity, ShoppingCart,
    Wallet, ClipboardCheck, ArrowUpRight, Plus
} from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { Button } from "@/components/ui/button";
import { useAdminStats, useAdminRevenue } from '../hooks/useAdminStats';
import { useAdminBookings } from '../hooks/useAdminBookings';
import StatusBadge from '../components/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';

const Dashboard = () => {
    const { data: stats, isLoading: statsLoading } = useAdminStats();
    const { data: revenueData, isLoading: revenueLoading } = useAdminRevenue();
    const { data: recentBookings, isLoading: bookingsLoading } = useAdminBookings();

    const revenueArray = Array.isArray(revenueData) ? revenueData : [];

    const formattedRevenue = revenueArray.map((item: any) => ({
        month: item.month ? format(new Date(item.month), 'MMM') : 'N/A',
        amount: Number(item.total || item.amount || 0)
    }));

    const kpiCards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, trend: { value: 12, isPositive: true } },
        { title: 'Active Farmers', value: stats?.activeFarmers || 0, icon: Tractor, trend: { value: 8, isPositive: true } },
        { title: 'Pending Farms', value: stats?.pendingFarms || 0, icon: ClipboardCheck, color: 'text-yellow-600' },
        { title: 'Active Sensors', value: stats?.activeSensors || 0, icon: Activity, trend: { value: 24, isPositive: true } },
        { title: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: Wallet, trend: { value: 18, isPositive: true } },
        { title: 'Pending Bookings', value: stats?.pendingBookings || 0, icon: ShoppingCart },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="hidden sm:flex items-center gap-2">
                        <Plus size={16} />
                        Add Sensor
                    </Button>
                    <Button className="flex items-center gap-2">
                        <Plus size={16} />
                        New Service
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {statsLoading ? (
                    Array(6).fill(0).map((_, idx) => (
                        <div key={idx} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
                    ))
                ) : (
                    kpiCards.map((card, idx) => (
                        <StatCard
                            key={idx}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            trend={card.trend}
                        />
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {revenueLoading ? (
                    <div className="h-[350px] bg-gray-100 rounded-xl animate-pulse" />
                ) : (
                    <ChartCard
                        title="Revenue Over Time (Monthly)"
                        data={formattedRevenue}
                        type="area"
                        dataKey="amount"
                        categoryKey="month"
                        height={350}
                    />
                )}
                {revenueLoading ? (
                    <div className="h-[350px] bg-gray-100 rounded-xl animate-pulse" />
                ) : (
                    <ChartCard
                        title="Booking volume trend"
                        data={formattedRevenue}
                        type="bar"
                        dataKey="amount"
                        categoryKey="month"
                        height={350}
                        color="#22c55e"
                    />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Recent Bookings</CardTitle>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-medium">
                            View All <ArrowUpRight size={14} className="ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 text-gray-400 font-medium uppercase text-[10px] tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Service</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bookingsLoading ? (
                                        Array(5).fill(0).map((_, idx) => (
                                            <tr key={idx}>
                                                <td colSpan={5} className="px-6 py-4">
                                                    <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (Array.isArray(recentBookings) && recentBookings.length > 0) ? (
                                        recentBookings.slice(0, 5).map((booking: any) => (
                                            <tr key={booking.id} className="hover:bg-gray-50/30 transition-colors group">
                                                <td className="px-6 py-4 font-medium text-gray-900">{booking.user?.name}</td>
                                                <td className="px-6 py-4 text-gray-600">{booking.service_type}</td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {booking.booking_date ? format(new Date(booking.booking_date), 'dd MMM yyyy') : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">₹{Number(booking.amount).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <StatusBadge status={booking.status} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                                No recent bookings found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start gap-3 h-12">
                            <Users size={18} className="text-blue-500" />
                            Verify Pending Kyc
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-3 h-12">
                            <Tractor size={18} className="text-green-500" />
                            Approve New Farms
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-3 h-12">
                            <Activity size={18} className="text-purple-500" />
                            Sensor Health Check
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-3 h-12">
                            <ShoppingCart size={18} className="text-orange-500" />
                            Review Service Bookings
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
