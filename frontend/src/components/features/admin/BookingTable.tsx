import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface BookingTableProps {
  bookings: any[];
  onStatusUpdate: (id: number, status: string) => void;
}

export function BookingTable({
  bookings,
  onStatusUpdate,
}: BookingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>ID</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {bookings.map((b) => (
          <TableRow
            key={b.id}
            className="hover:bg-muted/40 transition-colors"
          >
            <TableCell className="text-xs text-muted-foreground">
              {b.id}
            </TableCell>

            <TableCell className="font-medium">
              {b.service}
            </TableCell>

            <TableCell>{b.user}</TableCell>

            <TableCell>{b.date}</TableCell>

            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  b.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : b.status === "Approved"
                    ? "bg-blue-100 text-blue-700"
                    : b.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {b.status}
              </span>
            </TableCell>

            <TableCell className="text-right">
              {b.status === "Pending" && (
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-green-600 hover:bg-green-100"
                    onClick={() =>
                      onStatusUpdate(b.id, "Approved")
                    }
                  >
                    <Check className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-100"
                    onClick={() =>
                      onStatusUpdate(b.id, "Rejected")
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}