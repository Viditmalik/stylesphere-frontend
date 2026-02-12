import { Product } from "@/data/products";

const API_URL = "http://localhost:8082/api";

export interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface BackendOrder {
  id: number;
  customerName: string;
  email: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: BackendOrderItem[];
}

export interface BackendOrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}


// Adapter to transform Backend Product to Frontend Product
const adaptProduct = (bp: BackendProduct): Product => {
  return {
    id: bp.id,
    name: bp.name,
    price: bp.price,
    description: bp.description,
    category: bp.category as any, // Cast or map properly if needed
    subcategory: "general", // Default
    images: [bp.imageUrl],
    sizes: ["S", "M", "L", "XL"], // Default
    colors: [{ name: "Default", hex: "#000000" }], // Default
    rating: 4.5, // Default
    reviews: 0,
    isNew: true,
  };
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data: BackendProduct[] = await response.json();
    return data.map(adaptProduct);
  } catch (error) {
    console.error("Error fetching products from backend:", error);
    throw error;
  }
};

export const fetchProductById = async (id: number): Promise<Product | undefined> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error("Failed to fetch product");
    }
    const data: BackendProduct = await response.json();
    return adaptProduct(data);
  } catch (error) {
    console.error(`Error fetching product ${id} from backend:`, error);
    throw error;
  }
};

// Product Management
export const createProduct = async (product: Omit<BackendProduct, 'id'>): Promise<BackendProduct> => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Failed to create product");
  return await response.json();
};

export const updateProduct = async (id: number, product: Partial<BackendProduct>): Promise<BackendProduct> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Failed to update product");
  return await response.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
};

// Order Management
export const fetchAllOrders = async (email?: string): Promise<BackendOrder[]> => {
  try {
    const url = email
      ? `${API_URL}/orders?email=${encodeURIComponent(email)}`
      : `${API_URL}/orders`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (id: number, status: string): Promise<BackendOrder> => {
  const response = await fetch(`${API_URL}/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update status");
  return await response.json();
};

export const placeOrder = async (orderData: any): Promise<BackendOrder> => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error("Failed to place order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};
