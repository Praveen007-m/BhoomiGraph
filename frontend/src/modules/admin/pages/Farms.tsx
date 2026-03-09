import React, { useState } from 'react';
import { useAdminFarms, useUpdateFarmStatus } from '../hooks/useAdminFarms';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { Button } from "@/components/ui/button";
import { Check, X, Eye, Map as MapIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const FarmsPage = () => {
    const [statusFilter, setStatusFilter] = useState('');
    const { data: farms, isLoading } = useAdminFarms({ status: statusFilter });
    const updateFarmStatus = useUpdateFarmStatus();

    const handleAction = (id: string, status: string) => {
        updateFarmStatus.mutate({ id, status }, {
            onSuccess: () => toast.success(`Farm ${status}`),
            onError: () => toast.error('Failed to update status')
        });
    };

    const columns = [
        { header: 'Farm Name', accessorKey: 'name', className: 'font-medium' },
        {
            header: 'Owner',
            cell: (farm: any) => (
                <div>
                    <p className="font-medium text-gray-900">{farm.user?.name}</p>
                    <p className="text-xs text-gray-500">{farm.user?.email}</p>
                </div>
            )
        },
        { header: 'Location', accessorKey: 'location' },
        {
            header: 'Area',
            cell: (farm: any) => `${farm.area_acres || 0} Acres`
        },
        {
            header: 'Created On',
            cell: (farm: any) => format(new Date(farm.createdAt), 'dd MMM yyyy')
        },
        {
            header: 'Status',
            cell: (farm: any) => <StatusBadge status={farm.status} />
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (farm: any) => (
                <div className="flex items-center justify-end gap-2">
                    {farm.status === 'pending' && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleAction(farm.id, 'approved')}
                            >
                                <Check size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleAction(farm.id, 'rejected')}
                            >
                                <X size={16} />
                            </Button>
                        </>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-gray-500">
                        <Eye size={14} /> View
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:items-baseline justify-between gap-2">
                <h1 className="text-2xl font-bold">Farm Approvals</h1>
                <p className="text-gray-500 text-sm">Review and approve farm registration requests.</p>
            </div>

            <div className="flex border-b">
                {[
                    { label: 'All Farms', value: '' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Approved', value: 'approved' },
                    { label: 'Rejected', value: 'rejected' },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${statusFilter === tab.value
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
                data={farms || []}
                isLoading={isLoading}
                emptyMessage="No farms found for this filter."
            />
        </div>
    );
};

export default FarmsPage;
