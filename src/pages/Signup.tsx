import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Min 6 characters";
    if (password !== confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await signup(name, email, password);
    if (success) {
      toast({ title: "Account created!", description: "Welcome to ShopHub." });
      navigate("/");
    } else {
      toast({ title: "Signup failed", description: "Email might be in use", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="container-custom py-20">
        <div className="max-w-md mx-auto">
          <h1 className="section-title text-center mb-2">Create Account</h1>
          <p className="text-center text-muted-foreground mb-8">Join ShopHub today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <input type="password" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field" />
              {errors.confirm && <p className="text-destructive text-xs mt-1">{errors.confirm}</p>}
            </div>
            <button type="submit" className="btn-primary w-full">Create Account</button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
