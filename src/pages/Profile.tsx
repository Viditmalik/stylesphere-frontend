import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { orders } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSave = () => {
    updateProfile({ name, phone, address });
    setEditing(false);
    toast({ title: "Profile updated!" });
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out" });
    navigate("/");
  };

  return (
    <Layout>
      <div className="container-custom py-10">
        <div className="max-w-2xl mx-auto">
          {/* User info */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <UserIcon size={24} className="text-muted-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold">{user?.name}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Edit profile */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Profile Details</h2>
              {!editing && (
                <button onClick={() => setEditing(true)} className="text-sm text-primary hover:underline">
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
                <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" />
                <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" />
                <div className="flex gap-3">
                  <button onClick={handleSave} className="btn-primary">Save</button>
                  <button onClick={() => setEditing(false)} className="btn-outline">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {user?.name}</p>
                <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
                <p><span className="text-muted-foreground">Phone:</span> {user?.phone || "Not set"}</p>
                <p><span className="text-muted-foreground">Address:</span> {user?.address || "Not set"}</p>
              </div>
            )}
          </section>

          {/* Order history */}
          <section className="mb-12">
            <h2 className="font-display text-lg font-semibold mb-4">Order History</h2>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-border p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-secondary">{order.status}</span>
                    </div>
                    <p className="text-sm">{order.items.length} item(s) · ${order.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Logout */}
          <button onClick={handleLogout} className="btn-outline flex items-center gap-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
