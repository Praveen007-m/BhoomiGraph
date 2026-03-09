import React, { useState } from 'react';
import { useAdminCrops, useAddCrop } from '../hooks/useAdminCrops';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { Button } from "@/components/ui/button";
import { Plus, Leaf, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

const CropsPage = () => {
    const { data: crops, isLoading } = useAdminCrops();

    const columns = [
        { header: 'Crop Name', accessorKey: 'name', className: 'font-medium' },
        { header: 'Scientific Name', accessorKey: 'scientific_name', className: 'italic text-gray-500' },
        { header: 'Season', accessorKey: 'season' },
        { header: 'Type', accessorKey: 'type' },
        {
            header: 'Status',
            cell: (crop: any) => (
                <StatusBadge status={crop.is_enabled ? 'active' : 'inactive'} />
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Crop Library</h1>
                    <p className="text-gray-500 text-sm">Maintain the master list of crops supported by the platform.</p>
                </div>
                <Button className="gap-2">
                    <Plus size={18} />
                    Add Crop
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input placeholder="Search crops..." className="pl-10" />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={crops || []}
                isLoading={isLoading}
                emptyMessage="No crops found in the library."
            />
        </div>
    );
};

export default CropsPage;
