import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<T> {
    columns: {
        header: string;
        accessorKey?: keyof T | string;
        cell?: (item: T) => React.ReactNode;
        className?: string;
    }[];
    data: T[];
    isLoading?: boolean;
    emptyMessage?: string;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
}

const DataTable = <T extends { id?: string | number }>({
    columns,
    data,
    isLoading,
    emptyMessage = "No data found",
    pagination
}: DataTableProps<T>) => {
    return (
        <div className="w-full">
            <div className="rounded-md border bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            {columns.map((column, idx) => (
                                <TableHead key={idx} className={cn("font-semibold text-gray-700", column.className)}>
                                    {column.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <TableRow key={idx}>
                                    {columns.map((_, cIdx) => (
                                        <TableCell key={cIdx}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : data.length > 0 ? (
                            data.map((item, rowIdx) => (
                                <TableRow key={item.id || rowIdx} className="hover:bg-gray-50/50 transition-colors">
                                    {columns.map((column, colIdx) => (
                                        <TableCell key={colIdx} className={column.className}>
                                            {column.cell
                                                ? column.cell(item)
                                                : column.accessorKey
                                                    ? (item[column.accessorKey as keyof T] as React.ReactNode)
                                                    : null
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
                        disabled={pagination.currentPage === 1}
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </Button>
                    <div className="text-sm font-medium text-gray-600">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                        disabled={pagination.currentPage === pagination.totalPages}
                    >
                        Next
                        <ChevronRight size={16} />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DataTable;
