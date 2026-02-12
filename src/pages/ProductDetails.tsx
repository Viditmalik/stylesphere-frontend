import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Minus, Plus, Star, ShoppingBag } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { ProductDetailSkeleton } from "@/components/skeletons/ProductSkeleton";
import { products as staticProducts, reviews } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById, fetchProducts } from "@/lib/api";

const ProductDetails = () => {
  const { id } = useParams();
  const productId = Number(id);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [uiLoading, setUiLoading] = useState(true);

  // Fetch current product
  const { data: backendProduct, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
    retry: 1,
  });

  // Fetch related products (using all products for now)
  const { data: allProducts } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    retry: 1,
  });

  const product = backendProduct || staticProducts.find((p) => p.id === productId);
  const currentProducts = allProducts && allProducts.length > 0 ? allProducts : staticProducts;

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
    const t = setTimeout(() => setUiLoading(false), 700);
    return () => clearTimeout(t);
  }, [id]);

  const setLoading = (loading: boolean) => setUiLoading(loading);
  const loading = uiLoading || isProductLoading;

  if (!loading && !product) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h1 className="section-title mb-4">Product Not Found</h1>
          <Link to="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </Layout>
    );
  }

  const discount = product && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const related = product
    ? currentProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
    : [];

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      toast({ title: "Select a size", variant: "destructive" });
      return;
    }
    if (!selectedColor) {
      toast({ title: "Select a color", variant: "destructive" });
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    toast({ title: "Added to cart!", description: `${product.name} × ${quantity}` });
  };

  if (loading || !product) {
    return (
      <Layout>
        <div className="container-custom py-10">
          <ProductDetailSkeleton />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container-custom py-10">
        <>
          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground mb-8 flex gap-2">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-foreground">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {/* Images */}
            <div>
              <div className="aspect-[3/4] bg-secondary overflow-hidden mb-3">
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-24 overflow-hidden border-2 transition-colors ${activeImage === i ? "border-foreground" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(product.rating) ? "fill-accent text-accent" : "text-border"}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-semibold">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                    <span className="badge-sale">-{discount}%</span>
                  </>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              {/* Size */}
              <div className="mb-6">
                <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground block mb-3">Size</label>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 text-sm font-medium border transition-colors ${selectedSize === s ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="mb-8">
                <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground block mb-3">Color</label>
                <div className="flex gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c.name ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground block mb-3">Quantity</label>
                <div className="flex items-center border border-border w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-secondary transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="px-6 text-sm font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-secondary transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <ShoppingBag size={16} /> Add to Cart
                </button>
                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast({
                      title: isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist",
                    });
                  }}
                  className="btn-outline px-4"
                  aria-label="Toggle wishlist"
                >
                  <Heart size={18} className={isInWishlist(product.id) ? "fill-primary text-primary" : ""} />
                </button>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <section className="mt-20">
            <h2 className="section-title mb-8">Reviews</h2>
            <div className="space-y-6 max-w-2xl">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-border pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? "fill-accent text-accent" : "text-border"} />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{r.user}</span>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="section-title mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </>
      </div>
    </Layout>
  );
};

export default ProductDetails;
