import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PaymentTableProps {
  payments: any[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>ID</TableHead>
          <TableHead>User ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {payments.map((p) => (
          <TableRow
            key={p.id}
            className="hover:bg-muted/40 transition-colors"
          >
            <TableCell className="text-xs text-muted-foreground">
              {p.id}
            </TableCell>

            <TableCell>{p.user_id}</TableCell>

            <TableCell className="font-semibold text-green-700">
              ₹{p.amount}
            </TableCell>

            <TableCell className="text-xs">
              {p.razorpay_order_id}
            </TableCell>

            <TableCell>
              <span
                className={`px-2 py-1 text-xs rounded-full font-medium ${
                  p.status === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {p.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}