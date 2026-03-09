import React from 'react';
import { useAdminTransactions } from '../hooks/useAdminTransactions';
import DataTable from '../components/DataTable';
import { Button } from "@/components/ui/button";
import { Download, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { format } from 'date-fns';

const TransactionsPage = () => {
    const { data: transactions, isLoading } = useAdminTransactions();

    const columns = [
        {
            header: 'ID',
            accessorKey: 'id',
            className: 'font-mono text-[10px] text-gray-500 w-24'
        },
        {
            header: 'User',
            cell: (t: any) => t.user?.name || 'Anonymous'
        },
        {
            header: 'Amount',
            cell: (t: any) => (
                <span className="font-bold">₹{t.amount}</span>
            )
        },
        { header: 'Status', accessorKey: 'status' },
        {
            header: 'Method',
            cell: (t: any) => t.payment_method || 'Wallet'
        },
        {
            header: 'Date',
            cell: (t: any) => format(new Date(t.createdAt), 'dd MMM yyyy, HH:mm')
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Transactions</h1>
                    <p className="text-gray-500 text-sm">Full history of all financial activities on the platform.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download size={18} />
                    Export CSV
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={transactions || []}
                isLoading={isLoading}
            />
        </div>
    );
};

export default TransactionsPage;
