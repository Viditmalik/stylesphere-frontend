import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="container-custom py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="font-display text-2xl font-bold mb-4">ShopHub</h3>
          <p className="text-sm opacity-70 leading-relaxed">
            Timeless fashion, consciously crafted. We believe in quality over quantity.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center opacity-70 hover:opacity-100 hover:border-background/50 transition-all"><Instagram size={16} /></a>
            <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center opacity-70 hover:opacity-100 hover:border-background/50 transition-all"><Twitter size={16} /></a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center opacity-70 hover:opacity-100 hover:border-background/50 transition-all"><Facebook size={16} /></a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-sm font-semibold tracking-widest uppercase mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm opacity-70">
            <li><Link to="/shop?category=women" className="hover:opacity-100 transition-opacity">Women</Link></li>
            <li><Link to="/shop?category=men" className="hover:opacity-100 transition-opacity">Men</Link></li>
            <li><Link to="/shop?category=kids" className="hover:opacity-100 transition-opacity">Kids</Link></li>
            <li><Link to="/shop" className="hover:opacity-100 transition-opacity">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-sm font-semibold tracking-widest uppercase mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm opacity-70">
            <li><a href="#" className="hover:opacity-100 transition-opacity">About Us</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Sustainability</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Careers</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Press</a></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-sm font-semibold tracking-widest uppercase mb-4">Help</h4>
          <ul className="space-y-2.5 text-sm opacity-70">
            <li><a href="#" className="hover:opacity-100 transition-opacity">Shipping & Returns</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Size Guide</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">Contact Us</a></li>
            <li><a href="#" className="hover:opacity-100 transition-opacity">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/15 mt-12 pt-8 text-center text-xs opacity-40">
        © 2026 ShopHub. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
