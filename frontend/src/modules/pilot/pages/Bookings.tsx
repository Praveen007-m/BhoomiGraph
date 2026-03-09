import React from 'react';
import { usePilotBookings } from '../hooks/usePilotBookings';
import DataTable from '../../admin/components/DataTable';
import StatusBadge from '../../admin/components/StatusBadge';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Calendar,
    ExternalLink,
    MapPin,
    Search,
    Filter,
    ClipboardList
} from 'lucide-react';
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';

const PilotBookings = () => {
    const { data: bookings, isLoading } = usePilotBookings();
    const navigate = useNavigate();

    const columns = [
        {
            header: 'Service Type',
            cell: (booking: any) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{booking.service_type}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">ID: {booking.id.slice(0, 8)}</span>
                </div>
            )
        },
        {
            header: 'Farm & Location',
            cell: (booking: any) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700">{booking.farm?.name}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                        <MapPin size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-500">{booking.farm?.location || 'Not Specified'}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Farmer',
            cell: (booking: any) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{booking.user?.name}</span>
                    <span className="text-xs text-slate-500">{booking.user?.mobile}</span>
                </div>
            )
        },
        {
            header: 'Scheduled Date',
            cell: (booking: any) => (
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    <span className="text-sm font-medium text-slate-900">
                        {booking.booking_date ? format(new Date(booking.booking_date), 'dd MMM yyyy') : 'N/A'}
                    </span>
                </div>
            )
        },
        {
            header: 'Status',
            cell: (booking: any) => <StatusBadge status={booking.status} />
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (booking: any) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/pilot/bookings/${booking.id}`)}
                    className="rounded-lg h-9 font-bold gap-2"
                >
                    Details
                    <ExternalLink size={14} />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
                    <p className="text-slate-500 font-medium">View and manage your assigned survey bookings.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Assigned Total</p>
                    <p className="text-lg font-bold text-primary">{bookings?.length || 0}</p>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <Input
                            placeholder="Search bookings..."
                            className="h-10 pl-10 rounded-lg border-slate-200 bg-white"
                        />
                    </div>
                </div>
                <div className="p-0">
                    <DataTable
                        columns={columns}
                        data={bookings || []}
                        isLoading={isLoading}
                        emptyMessage="No missions currently assigned to you."
                    />
                </div>
            </Card>
        </div>
    );
};

export default PilotBookings;
