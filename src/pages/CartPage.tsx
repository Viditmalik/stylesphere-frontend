import { Link } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="section-title mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-10">
        <h1 className="section-title mb-8">Shopping Cart ({totalItems})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 border-b border-border pb-6">
                <Link to={`/product/${item.productId}`} className="w-24 h-32 bg-secondary shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Link to={`/product/${item.productId}`}>
                      <h3 className="font-medium text-sm hover:text-primary transition-colors">{item.name}</h3>
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size, item.color)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Size: {item.size} · Color: {item.color}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="p-2 hover:bg-secondary transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-4 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="p-2 hover:bg-secondary transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-secondary p-6 h-fit">
            <h3 className="font-display text-lg font-semibold mb-6">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{totalPrice > 100 ? "Free" : "$9.99"}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>${(totalPrice + (totalPrice > 100 ? 0 : 9.99)).toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full text-center block mt-6">
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="block text-center text-sm text-muted-foreground mt-3 hover:text-foreground transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
