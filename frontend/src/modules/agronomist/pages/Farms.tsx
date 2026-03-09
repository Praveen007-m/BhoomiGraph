import React from 'react';
import { useAgronomistFarms } from '../hooks/useAdvisories';
import DataTable from '../../admin/components/DataTable';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Search,
    MapPin,
    User,
    Database,
    ChevronRight,
    Sprout,
    Activity
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';

const AgronomistFarms = () => {
    const { data: farms, isLoading } = useAgronomistFarms();
    const navigate = useNavigate();

    const columns = [
        {
            header: 'Farm Name',
            cell: (farm: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                        <Sprout size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 leading-none">{farm.name}</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-1">ID: #{farm.id.slice(0, 8)}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Location',
            cell: (farm: any) => (
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{farm.location || 'Not Specified'}</span>
                </div>
            )
        },
        {
            header: 'Farmer',
            cell: (farm: any) => (
                <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{farm.user?.name || 'Unknown'}</span>
                </div>
            )
        },
        {
            header: 'Telemetry',
            cell: (farm: any) => (
                <div className="flex gap-2">
                    <div className={`p-1.5 rounded-lg border ${farm.DroneSurveys?.length ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`} title="Drone Data">
                        <Database size={14} />
                    </div>
                    <div className={`p-1.5 rounded-lg border ${farm.iot_devices?.length ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`} title="IoT Data">
                        <Activity size={14} />
                    </div>
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (farm: any) => (
                <Button
                    onClick={() => navigate(`/agronomist/farms/${farm.id}`)}
                    className="h-9 px-5 rounded-lg bg-white hover:bg-primary hover:text-white text-gray-600 border border-gray-200 hover:border-primary font-semibold text-xs transition-all shadow-sm"
                >
                    Review Data <ChevronRight size={14} className="ml-1" />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Farm Registry</h1>
                    <p className="text-gray-500 font-medium">Aggregate view of all assigned sectors and telemetry</p>
                </div>
            </div>

            <Card className="bg-white border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Search by farm or farmer..."
                            className="h-11 pl-12 rounded-xl border-gray-200 bg-white text-gray-900 focus:ring-primary/20 shadow-none text-sm"
                        />
                    </div>
                </div>
                <div className="p-2">
                    <DataTable
                        columns={columns}
                        data={farms || []}
                        isLoading={isLoading}
                        emptyMessage="No farms currently assigned for analysis."
                    />
                </div>
            </Card>
        </div>
    );
};

export default AgronomistFarms;
