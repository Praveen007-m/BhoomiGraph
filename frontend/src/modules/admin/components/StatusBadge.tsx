import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = 'pending' | 'approved' | 'rejected' | 'inactive' | 'completed' | 'active' | 'confirmed' | 'cancelled';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const statusConfig: Record<StatusType, { label: string, className: string }> = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200' },
    approved: { label: 'Approved', className: 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200' },
    inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200' },
    active: { label: 'Active', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200' },
    completed: { label: 'Completed', className: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-indigo-200' },
    confirmed: { label: 'Confirmed', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
    cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground hover:bg-muted border-muted' },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
    const s = status.toLowerCase() as StatusType;
    const config = statusConfig[s] || { label: status, className: 'bg-gray-100 text-gray-700' };

    return (
        <Badge variant="outline" className={cn("font-medium capitalize px-2.5 py-0.5 rounded-full", config.className, className)}>
            {config.label}
        </Badge>
    );
};

export default StatusBadge;
