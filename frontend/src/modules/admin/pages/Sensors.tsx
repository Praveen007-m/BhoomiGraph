import React, { useState } from 'react';
import { useAdminSensors, useAddSensor } from '../hooks/useAdminSensors';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { Button } from "@/components/ui/button";
import { Plus, Activity, Battery, Wifi, Settings } from 'lucide-react';
import { toast } from 'sonner';

const SensorsPage = () => {
    const { data: sensors, isLoading } = useAdminSensors();
    const addSensor = useAddSensor();

    const columns = [
        { header: 'Device UID', accessorKey: 'device_uid', className: 'font-mono text-xs' },
        { header: 'Name', accessorKey: 'name', className: 'font-medium' },
        { header: 'Type', accessorKey: 'type' },
        {
            header: 'Health',
            cell: (sensor: any) => (
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1"><Battery size={14} className="text-green-500" /> 85%</div>
                    <div className="flex items-center gap-1"><Wifi size={14} className="text-blue-500" /> Strong</div>
                </div>
            )
        },
        {
            header: 'Status',
            cell: (sensor: any) => <StatusBadge status={sensor.is_active ? 'active' : 'inactive'} />
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (sensor: any) => (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings size={16} />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">IoT Infrastructure</h1>
                    <p className="text-gray-500 text-sm">Monitor and manage all deployed field sensors.</p>
                </div>
                <Button className="gap-2">
                    <Plus size={18} />
                    Register Sensor
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white rounded-lg border flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-full text-green-600"><Activity size={24} /></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Online Sensors</p>
                        <p className="text-xl font-bold">42 / 45</p>
                    </div>
                </div>
                {/* More mini stats if needed */}
            </div>

            <DataTable
                columns={columns}
                data={sensors || []}
                isLoading={isLoading}
                emptyMessage="No sensors registered in the system."
            />
        </div>
    );
};

export default SensorsPage;
