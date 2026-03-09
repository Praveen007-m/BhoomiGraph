import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmerBookings } from '../hooks/useFarmer';
import DataTable from '../../admin/components/DataTable';
import StatusBadge from '../../admin/components/StatusBadge';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Calendar, ExternalLink, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";

const Services = () => {
    const navigate = useNavigate();
    const { data: bookings, isLoading } = useFarmerBookings();

    const columns = [
        {
            header: 'Service',
            cell: (booking: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 group-hover:text-green-600 group-hover:bg-green-50 transition-colors">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="font-black text-slate-900 leading-tight">{booking.service_type}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">ID: #{booking.id.slice(0, 8)}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Farm Location',
            cell: (booking: any) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">{booking.farm?.name}</span>
                    <span className="text-[10px] font-medium text-slate-400">{booking.farm?.location || 'Aerial Survey Area'}</span>
                </div>
            )
        },
        {
            header: 'Scheduled Date',
            cell: (booking: any) => (
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-sm font-black text-slate-600">{format(new Date(booking.booking_date), 'dd MMM yyyy')}</span>
                </div>
            )
        },
        {
            header: 'Cost',
            cell: (booking: any) => (
                <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">₹{booking.amount}</span>
                    <span className="text-[10px] font-bold text-green-600">Wallet Payment</span>
                </div>
            )
        },
        {
            header: 'Status',
            cell: (booking: any) => <StatusBadge status={booking.status} />
        },
        {
            header: 'Action',
            className: 'text-right',
            cell: (booking: any) => (
                <Button variant="ghost" size="sm" className="font-black text-xs text-green-600 hover:bg-green-50 rounded-lg">
                    Manage <ExternalLink size={14} className="ml-2" />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Services & Bookings</h1>
                    <p className="text-slate-500 font-medium font-outfit">Manage your precision farming service requests.</p>
                </div>
                <Button
                    onClick={() => navigate('/farmer/bookings/new')}
                    className="rounded-2xl h-14 px-8 font-black bg-green-600 hover:bg-green-700 shadow-xl shadow-green-100 gap-3 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
                >
                    <Plus size={20} />
                    Book New Service
                </Button>
            </div>

            <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Search bookings..."
                            className="pl-12 h-12 rounded-2xl border-slate-200 bg-white font-medium focus:ring-green-500/20"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-12 rounded-2xl font-bold border-slate-200 gap-2">
                            <Filter size={18} />
                            Filter
                        </Button>
                    </div>
                </div>
                <div className="p-2">
                    <DataTable
                        columns={columns}
                        data={bookings || []}
                        isLoading={isLoading}
                        emptyMessage="No service missions found. Start your first precision survey today!"
                    />
                </div>
            </Card>
        </div>
    );
};

export default Services;
