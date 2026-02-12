import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchAllOrders } from "@/lib/api";

const Orders = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: () => fetchAllOrders(user?.email || ""),
    enabled: !!user?.email, // Only fetch if user has an email
  });

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (isLoading) return <Layout><div className="container-custom py-10">Loading orders...</div></Layout>;
  if (error) return <Layout><div className="container-custom py-10 text-red-500">Error loading orders.</div></Layout>;

  return (
    <Layout>
      <div className="container-custom py-10">
        <h1 className="section-title mb-8">Order History</h1>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
            <button onClick={() => navigate("/shop")} className="btn-primary">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl">
            {orders.map((order) => (
              <div key={order.id} className="border border-border p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <div>
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs font-medium px-3 py-1 bg-secondary w-fit">{order.status}</span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.productName} ({item.size}, {item.color}) × {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-sm text-muted-foreground">Shipped to: {order.shippingAddress}</span>
                  <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
