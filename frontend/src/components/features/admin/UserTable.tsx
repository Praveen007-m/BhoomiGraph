import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface UserTableProps {
  users: any[];
}

export function UserTable({ users }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((u) => (
          <TableRow
            key={u.id}
            className="hover:bg-muted/40 transition-colors"
          >
            <TableCell className="text-xs text-muted-foreground">
              {u.id}
            </TableCell>

            <TableCell className="font-medium">
              {u.name}
            </TableCell>

            <TableCell>{u.email}</TableCell>

            <TableCell>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium capitalize">
                {u.role}
              </span>
            </TableCell>

            <TableCell className="text-right">
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-700 hover:text-primary hover:bg-green-100"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}