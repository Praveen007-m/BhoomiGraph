import React from 'react';
import { useAdminPilots } from '../hooks/useAdminPilots';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Award } from 'lucide-react';

const PilotsPage = () => {
    const { data: pilots, isLoading } = useAdminPilots();

    const columns = [
        { header: 'Pilot Name', accessorKey: 'name', className: 'font-medium' },
        {
            header: 'Contact',
            cell: (p: any) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500"><Mail size={12} /> {p.email}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500"><Phone size={12} /> {p.mobile}</div>
                </div>
            )
        },
        {
            header: 'Performance',
            cell: () => (
                <div className="flex items-center gap-1 text-yellow-500">
                    <Award size={14} /> 4.8 (12 missions)
                </div>
            )
        },
        {
            header: 'Availability',
            cell: (p: any) => <StatusBadge status={p.is_active ? 'active' : 'inactive'} />
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: () => (
                <Button variant="outline" size="sm">Schedule</Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Drone Pilot Registry</h1>
                <p className="text-gray-500 text-sm">Manage and assign drone pilots for field missions.</p>
            </div>

            <DataTable
                columns={columns}
                data={pilots || []}
                isLoading={isLoading}
            />
        </div>
    );
};

export default PilotsPage;
