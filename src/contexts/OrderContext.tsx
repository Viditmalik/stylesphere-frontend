import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "./CartContext";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: "Processing" | "Shipped" | "Delivered";
  address: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], total: number, address: string) => string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (items: CartItem[], total: number, address: string) => {
    const id = "ORD-" + Date.now().toString(36).toUpperCase();
    const order: Order = {
      id,
      items,
      total,
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
      address,
    };
    setOrders((prev) => [order, ...prev]);
    return id;
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
