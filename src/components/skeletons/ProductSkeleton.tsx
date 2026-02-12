const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] bg-muted rounded-lg" />
    <div className="pt-3 pb-1 space-y-2">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="h-4 bg-muted rounded w-1/3" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 animate-pulse">
    <div>
      <div className="aspect-[3/4] bg-muted rounded-lg" />
      <div className="flex gap-3 mt-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-20 h-24 bg-muted rounded" />
        ))}
      </div>
    </div>
    <div className="space-y-4 pt-2">
      <div className="h-8 bg-muted rounded w-2/3" />
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-7 bg-muted rounded w-1/4 mt-2" />
      <div className="space-y-2 mt-4">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
      </div>
      <div className="flex gap-2 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-12 h-12 bg-muted rounded" />
        ))}
      </div>
      <div className="h-12 bg-muted rounded w-full mt-6" />
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="aspect-[3/4] bg-muted rounded-xl animate-pulse" />
    ))}
  </div>
);

export default ProductCardSkeleton;
