import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { ProductGridSkeleton, CategorySkeleton } from "@/components/skeletons/ProductSkeleton";
import heroBanner from "@/assets/hero-banner.jpg";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const trending = products.filter((p) => p.isTrending).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast({ title: "Subscribed!", description: "Thank you for joining our newsletter." });
      setEmail("");
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[75vh] md:h-[90vh] overflow-hidden">
        <img src={heroBanner} alt="Fashion collection" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.2) 60%, transparent 100%)" }} />
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-sm border border-background/20 rounded-full px-4 py-1.5 mb-6">
                <Sparkles size={14} className="text-accent" />
                <span className="text-background/90 text-xs tracking-widest uppercase font-medium">New Collection 2026</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-background leading-[1.1] mb-6">
                Define Your <span className="italic">Style</span>
              </h1>
              <p className="text-background/75 mb-10 text-base md:text-lg leading-relaxed max-w-md">
                Discover timeless pieces crafted for the modern wardrobe. Quality that speaks for itself.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/shop" className="btn-gold">
                  Shop Collection
                </Link>
                <Link to="/shop?category=women" className="btn-outline border-background/50 text-background hover:bg-background hover:text-foreground">
                  Women's Edit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-card">
        <div className="container-custom py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: "Free Shipping", sub: "On orders $100+" },
              { icon: RefreshCw, label: "Easy Returns", sub: "30-day guarantee" },
              { icon: ShieldCheck, label: "Secure Payment", sub: "256-bit encryption" },
              { icon: Sparkles, label: "Premium Quality", sub: "Crafted with care" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-custom py-20">
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">Browse by</p>
          <h2 className="section-title">Shop by Category</h2>
        </div>
        {loading ? (
          <CategorySkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="relative group overflow-hidden aspect-[3/4] rounded-xl"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent group-hover:from-foreground/70 transition-all duration-500" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="font-display text-3xl font-bold text-background">{cat.name}</h3>
                  <span className="inline-flex items-center gap-1.5 mt-2 text-background/80 text-sm font-medium group-hover:text-background transition-colors">
                    Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured */}
      <section className="container-custom pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-subtitle mb-2">Curated for you</p>
            <h2 className="section-title">Featured</h2>
          </div>
          <Link to="/shop" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(348 70% 50%), hsl(38 92% 50%))" }}>
        <div className="container-custom py-16 md:py-20 text-center relative z-10">
          <p className="text-primary-foreground/80 text-xs tracking-[0.2em] uppercase font-medium mb-3">Limited Time</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            Up to 40% Off Everything
          </h2>
          <p className="text-primary-foreground/75 mb-8 max-w-md mx-auto">
            Don't miss out on our biggest sale of the season. Shop before it's gone.
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-3 rounded-md font-semibold text-sm uppercase tracking-wide hover:bg-background/90 transition-all duration-300">
            Shop the Sale <ArrowRight size={16} />
          </Link>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-background/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-background/10 rounded-full blur-3xl" />
      </section>

      {/* Trending */}
      <section className="bg-muted py-20">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-subtitle mb-2">What's hot</p>
              <h2 className="section-title">Trending Now</h2>
            </div>
            <Link to="/shop" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {trending.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-custom py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-subtitle mb-3">Stay in the loop</p>
          <h2 className="section-title mb-4">Join the <span className="gradient-text">MAISON</span> Community</h2>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">
            Be the first to know about new collections, exclusive offers, and style inspiration.
          </p>
          <form onSubmit={handleNewsletter} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field flex-1"
              required
            />
            <button type="submit" className="btn-gold whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
