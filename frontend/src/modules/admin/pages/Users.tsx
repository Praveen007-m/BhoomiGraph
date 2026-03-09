import React, { useState } from 'react';
import { useAdminUsers, useUpdateUser, useDeleteUser } from '../hooks/useAdminUsers';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, MoreVertical, Edit2, Trash2, UserCheck, UserX } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmDialog from '../components/ConfirmDialog';
import { toast } from 'sonner';

const UsersPage = () => {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data: users, isLoading } = useAdminUsers({ search, role: roleFilter });
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();

    const handleRoleUpdate = (id: string, newRole: string) => {
        updateUser.mutate({ id, data: { role: newRole } }, {
            onSuccess: () => toast.success('User role updated'),
            onError: () => toast.error('Failed to update role')
        });
    };

    const handleToggleStatus = (id: string, currentActive: boolean) => {
        updateUser.mutate({ id, data: { is_active: !currentActive } }, {
            onSuccess: () => toast.success(`User ${currentActive ? 'deactivated' : 'activated'}`),
        });
    };

    const handleDelete = () => {
        if (deleteId) {
            deleteUser.mutate(deleteId, {
                onSuccess: () => {
                    toast.success('User removed');
                    setDeleteId(null);
                }
            });
        }
    };

    const columns = [
        { header: 'Name', accessorKey: 'name', className: 'font-medium' },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Role',
            cell: (user: any) => (
                <span className="capitalize px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                    {user.role}
                </span>
            )
        },
        {
            header: 'Status',
            cell: (user: any) => (
                <StatusBadge status={user.is_active ? 'active' : 'inactive'} />
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (user: any) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical size={16} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleToggleStatus(user.id, user.is_active)}>
                            {user.is_active ? <UserX size={14} className="mr-2" /> : <UserCheck size={14} className="mr-2" />}
                            {user.is_active ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteId(user.id)} className="text-red-600">
                            <Trash2 size={14} className="mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-gray-500 text-sm">Manage all platform users and their access levels.</p>
                </div>
                <Button className="gap-2">
                    <UserPlus size={18} />
                    Add User
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search users..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="h-10 px-3 rounded-md border border-gray-200 bg-white text-sm outline-none w-full sm:w-48"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="farmer">Farmer</option>
                    <option value="pilot">Pilot</option>
                    <option value="agronomist">Agronomist</option>
                </select>
            </div>

            <DataTable columns={columns} data={users || []} isLoading={isLoading} />

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
                variant="destructive"
            />
        </div>
    );
};

export default UsersPage;
