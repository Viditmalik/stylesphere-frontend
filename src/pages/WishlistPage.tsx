import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { products } from "@/data/products";

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <Layout>
      <div className="container-custom py-10">
        <h1 className="section-title mb-8">Wishlist ({wishlist.length})</h1>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-8">Your wishlist is empty.</p>
            <Link to="/shop" className="btn-primary">Discover Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {wishlistProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WishlistPage;
