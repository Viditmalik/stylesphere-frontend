import { Link } from "react-router-dom";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { Product } from "@/data/products";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const ProductCard = ({ product }: { product: Product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const wishlisted = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.images[0], quantity: 1, size: product.sizes[0], color: product.colors[0].name });
    toast({ title: "Added to cart!", description: `${product.name} added to your bag.` });
  };

  return (
    <div className="product-card group animate-fade-in">
      <div className="relative product-card-image">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500 rounded-lg" />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && <span className="badge-sale">-{discount}%</span>}
          {product.isNew && (
            <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 uppercase tracking-wider rounded">
              New
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-9 h-9 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-background hover:scale-110 shadow-sm"
          aria-label="Toggle wishlist"
        >
          <Heart
            size={16}
            className={`transition-colors duration-300 ${wishlisted ? "fill-primary text-primary" : "text-foreground"}`}
          />
        </button>

        {/* Quick add button */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 bg-foreground/90 backdrop-blur-sm text-background text-xs font-semibold uppercase tracking-wider py-2.5 rounded-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
        >
          <ShoppingBag size={14} />
          Quick Add
        </button>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-foreground leading-tight hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-0.5">
            ({product.reviews})
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-bold text-foreground">${product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
