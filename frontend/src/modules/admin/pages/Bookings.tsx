import React, { useState } from 'react';
import { useAdminBookings, useUpdateBookingStatus } from '../hooks/useAdminBookings';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { UserCheck, CheckCircle2, XCircle, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BookingsPage = () => {
    const [statusFilter, setStatusFilter] = useState('');
    const { data: bookings, isLoading } = useAdminBookings({ status: statusFilter });
    const updateBooking = useUpdateBookingStatus();

    const handleUpdateStatus = (id: string, status: string) => {
        updateBooking.mutate({ id, data: { status } }, {
            onSuccess: () => toast.success(`Booking ${status}`),
            onError: () => toast.error('Failed to update booking')
        });
    };

    const columns = [
        {
            header: 'Farmer',
            cell: (booking: any) => (
                <div>
                    <p className="font-medium text-gray-900">{booking.user?.name}</p>
                    <p className="text-xs text-gray-500">{booking.user?.mobile}</p>
                </div>
            )
        },
        { header: 'Service', accessorKey: 'service_type' },
        {
            header: 'Farm',
            cell: (booking: any) => (
                <div className="text-sm">
                    {booking.farm?.name}
                    <p className="text-xs text-gray-400 truncate w-32">{booking.farm?.location}</p>
                </div>
            )
        },
        {
            header: 'Scheduled',
            cell: (booking: any) => format(new Date(booking.booking_date), 'dd MMM yyyy')
        },
        {
            header: 'Pilot',
            cell: (booking: any) => (
                <span className={!booking.pilot ? 'text-orange-500 italic' : ''}>
                    {booking.pilot?.name || 'Unassigned'}
                </span>
            )
        },
        {
            header: 'Amount',
            cell: (booking: any) => `₹${booking.amount}`
        },
        {
            header: 'Status',
            cell: (booking: any) => <StatusBadge status={booking.status} />
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (booking: any) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'confirmed')}>
                            <UserCheck size={14} className="mr-2" /> Assign Pilot
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'completed')}>
                            <CheckCircle2 size={14} className="mr-2" /> Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'rejected')} className="text-red-600">
                            <XCircle size={14} className="mr-2" /> Reject & Refund
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:items-baseline justify-between gap-2">
                <h1 className="text-2xl font-bold">Service Bookings</h1>
                <p className="text-gray-500 text-sm">Manage mapping and scanning service requests.</p>
            </div>

            <div className="flex border-b overflow-x-auto">
                {[
                    { label: 'All Bookings', value: '' },
                    { label: 'Confirmed', value: 'confirmed' },
                    { label: 'In-Progress', value: 'in-progress' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Cancelled', value: 'cancelled' },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${statusFilter === tab.value
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setStatusFilter(tab.value)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <DataTable
                columns={columns}
                data={bookings || []}
                isLoading={isLoading}
                emptyMessage="No bookings matching your search."
            />
        </div>
    );
};

export default BookingsPage;
