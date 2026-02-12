import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllOrders, updateOrderStatus } from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import { useToast } from "@/components/ui/use-toast";

const AdminOrders = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: orders, isLoading, error } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: () => fetchAllOrders(),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            toast({ title: "Order status updated" });
        },
        onError: () => {
            toast({ title: "Failed to update status", variant: "destructive" });
        }
    });

    const handleStatusChange = (id: number, status: string) => {
        updateStatusMutation.mutate({ id, status });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading orders</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Admin Dashboard - Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Items</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders?.map((order: any) => (
                                    <TableRow key={order.id}>
                                        <TableCell>#{order.id}</TableCell>
                                        <TableCell>{order.customerName}</TableCell>
                                        <TableCell>{order.email}</TableCell>
                                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Select
                                                defaultValue={order.status}
                                                onValueChange={(value) => handleStatusChange(order.id, value)}
                                            >
                                                <SelectTrigger className="w-[130px]">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PENDING">Pending</SelectItem>
                                                    <SelectItem value="PROCESSING">Processing</SelectItem>
                                                    <SelectItem value="DISPATCHED">Dispatched</SelectItem>
                                                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                                                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="text-sm text-gray-600">
                                                    {item.quantity}x {item.productName} ({item.size}, {item.color})
                                                </div>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminOrders;
