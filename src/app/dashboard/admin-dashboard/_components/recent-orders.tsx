import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

const orders = [
  { id: "#1001", customer: "Rahim Uddin", amount: "$250.00", status: "Paid" },
  { id: "#1002", customer: "Ayesha Khan", amount: "$120.50", status: "Pending" },
  { id: "#1003", customer: "John Smith", amount: "$89.99", status: "Failed" },
  { id: "#1004", customer: "Maria Garcia", amount: "$430.00", status: "Paid" },
]

const variant = (s: string) =>
  s === "Paid" ? "default" : s === "Pending" ? "secondary" : "destructive"

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell>
                  <Badge variant={variant(o.status)}>{o.status}</Badge>
                </TableCell>
                <TableCell className="text-right">{o.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}