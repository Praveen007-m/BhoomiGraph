import React from 'react';
import { useAdvisories } from '../hooks/useAdvisories';
import DataTable from '../../admin/components/DataTable';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    FileText,
    Calendar,
    ExternalLink,
    Search,
    AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";

const AgronomistAdvisories = () => {
    const { data: advisories, isLoading } = useAdvisories();
    const navigate = useNavigate();

    const severityColors: any = {
        low: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        medium: 'text-amber-600 bg-amber-50 border-amber-100',
        high: 'text-orange-600 bg-orange-50 border-orange-100',
        critical: 'text-red-600 bg-red-50 border-red-100 font-bold'
    };

    const columns = [
        {
            header: 'Title',
            cell: (adv: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100">
                        <FileText size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 leading-none">{adv.title}</p>
                        <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase border mt-1.5", severityColors[adv.severity])}>
                            {adv.severity}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Target Farm',
            cell: (adv: any) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-700">{adv.farm?.name || 'Unknown Farm'}</span>
                    <span className="text-[11px] text-gray-400">ID: #{adv.farm?.id?.slice(0, 8) || 'N/A'}</span>
                </div>
            )
        },
        {
            header: 'Published',
            cell: (adv: any) => (
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{format(new Date(adv.createdAt), 'dd MMM yyyy')}</span>
                </div>
            )
        },
        {
            header: 'Status',
            cell: (adv: any) => (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        adv.status === 'published' ? 'bg-blue-500' : adv.status === 'resolved' ? 'bg-emerald-500' : 'bg-gray-300'
                    )} />
                    <span className="text-[11px] font-bold uppercase text-gray-500 tracking-wider font-mono">{adv.status}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (adv: any) => (
                <Button
                    onClick={() => navigate(`/agronomist/advisories/${adv.id}`)}
                    className="h-9 px-4 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary font-semibold text-xs transition-all shadow-sm"
                >
                    Review <ExternalLink size={12} className="ml-2" />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Advisory Registry</h1>
                    <p className="text-gray-500 font-medium">History of all scientific recommendations and alerts</p>
                </div>
            </div>

            <Card className="bg-white border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Search advisories or farms..."
                            className="h-11 pl-12 rounded-xl border-gray-200 bg-white text-gray-900 focus:ring-primary/20 shadow-none text-sm"
                        />
                    </div>
                </div>
                <div className="p-2">
                    <DataTable
                        columns={columns}
                        data={advisories || []}
                        isLoading={isLoading}
                        emptyMessage="No advisory reports found in the registry."
                    />
                </div>
            </Card>
        </div>
    );
};

export default AgronomistAdvisories;
