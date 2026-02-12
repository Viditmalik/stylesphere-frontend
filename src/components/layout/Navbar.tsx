import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useTheme } from "@/hooks/use-theme";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const { dark, toggle: toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "Women", to: "/shop?category=women" },
    { label: "Men", to: "/shop?category=men" },
    { label: "Kids", to: "/shop?category=kids" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-display text-xl md:text-2xl font-semibold tracking-tight text-foreground">
            ShopHub
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase"
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated && (user?.role === "ADMIN") && (
              <>
                <Link to="/admin/orders" className="text-sm font-medium tracking-wide text-red-600 hover:text-red-700 transition-colors uppercase">
                  Admin Orders
                </Link>
                <Link to="/admin/products" className="text-sm font-medium tracking-wide text-red-600 hover:text-red-700 transition-colors uppercase">
                  Admin Products
                </Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={toggleTheme} className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Toggle theme">
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="p-2 text-foreground hover:text-primary transition-colors relative" aria-label="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-2 text-foreground hover:text-primary transition-colors relative" aria-label="Cart">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Account"
            >
              <User size={20} />
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-4 animate-fade-in">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              autoFocus
            />
          </form>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background animate-slide-in">
          <nav className="container-custom py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium tracking-wide text-foreground uppercase py-2"
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated && (user?.role === "ADMIN") && (
              <>
                <Link
                  to="/admin/orders"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium tracking-wide text-red-600 uppercase py-2"
                >
                  Admin Orders
                </Link>
                <Link
                  to="/admin/products"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium tracking-wide text-red-600 uppercase py-2"
                >
                  Admin Products
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
