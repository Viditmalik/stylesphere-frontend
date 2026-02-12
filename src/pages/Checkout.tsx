import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [payment, setPayment] = useState<"card" | "cod">("card");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  const shipping = totalPrice > 100 ? 0 : 9.99;
  const total = totalPrice + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${form.address}, ${form.city}, ${form.zip}, ${form.country}`;

    // Prepare order payload for backend
    const orderPayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      address: fullAddress,
      totalAmount: total,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color
      }))
    };

    try {
      await import("@/lib/api").then(mod => mod.placeOrder(orderPayload));
      // Fallback to local context for simple state management if needed, but backend is primary now
      const id = addOrder(items, total, fullAddress);
      clearCart();
      setOrderId(id); // OR use backend ID: response.id
      setOrderPlaced(true);
      toast({ title: "Order placed successfully!" });
    } catch (error) {
      toast({ title: "Failed to place order", description: "Please try again.", variant: "destructive" });
    }
  };

  if (items.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  if (orderPlaced) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-primary" />
          </div>
          <h1 className="section-title mb-3">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-2">Your order ID is <span className="font-semibold text-foreground">{orderId}</span></p>
          <p className="text-muted-foreground mb-8">We'll send you an email with your order details.</p>
          <button onClick={() => navigate("/shop")} className="btn-primary">Continue Shopping</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-10">
        <h1 className="section-title mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping */}
            <div>
              <h2 className="font-display text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="input-field" required />
                <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="input-field" required />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input-field md:col-span-2" required />
                <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input-field md:col-span-2" required />
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="input-field" required />
                <input name="zip" placeholder="ZIP Code" value={form.zip} onChange={handleChange} className="input-field" required />
                <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className="input-field md:col-span-2" required />
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="font-display text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${payment === "card" ? "border-foreground" : "border-border"}`}>
                  <input type="radio" name="payment" checked={payment === "card"} onChange={() => setPayment("card")} className="accent-primary" />
                  <span className="text-sm font-medium">Credit / Debit Card</span>
                </label>
                <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${payment === "cod" ? "border-foreground" : "border-border"}`}>
                  <input type="radio" name="payment" checked={payment === "cod"} onChange={() => setPayment("cod")} className="accent-primary" />
                  <span className="text-sm font-medium">Cash on Delivery</span>
                </label>
              </div>
              {payment === "card" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <input placeholder="Card Number" className="input-field md:col-span-2" />
                  <input placeholder="MM/YY" className="input-field" />
                  <input placeholder="CVV" className="input-field" />
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-secondary p-6 h-fit">
            <h3 className="font-display text-lg font-semibold mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full mt-6">Place Order</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
