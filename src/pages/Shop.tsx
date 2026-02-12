import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeleton";
import { products as staticProducts } from "@/data/products";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";

const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = ["Black", "White", "Camel", "Navy", "Olive", "Cream", "Terracotta"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "";
  const urlSearch = searchParams.get("search") || "";

  const [category, setCategory] = useState(urlCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState(urlSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [uiLoading, setUiLoading] = useState(true);

  const { data: backendProducts, isLoading: isQueryLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    retry: 1,
  });

  const displayProducts = useMemo(() => {
    return backendProducts && backendProducts.length > 0 ? backendProducts : staticProducts;
  }, [backendProducts]);

  useEffect(() => {
    setUiLoading(true);
    const t = setTimeout(() => setUiLoading(false), 600);
    return () => clearTimeout(t);
  }, [urlCategory, urlSearch]);

  const loading = uiLoading || isQueryLoading;

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const toggleColor = (c: string) =>
    setSelectedColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const filtered = useMemo(() => {
    let result = [...displayProducts];

    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category) result = result.filter((p) => p.category === category);
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedSizes.length) result = result.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    if (selectedColors.length) result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c.name)));

    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "newest": result.sort((a, b) => ((b.isNew ? 1 : 0) as number) - ((a.isNew ? 1 : 0) as number)); break;
    }

    return result;
  }, [category, priceRange, selectedSizes, selectedColors, sort, search, displayProducts]);

  const clearFilters = () => {
    setCategory("");
    setPriceRange([0, 300]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSearch("");
  };

  const hasFilters = category || selectedSizes.length || selectedColors.length || search || priceRange[0] > 0 || priceRange[1] < 300;

  return (
    <Layout>
      <div className="container-custom py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="section-subtitle mb-1">Browse</p>
            <h1 className="section-title">
              {category ? category.charAt(0).toUpperCase() + category.slice(1) + "'s Collection" : "All Products"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{filtered.length} products</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="md:hidden btn-outline py-2 px-4 flex items-center gap-2 text-xs">
              <SlidersHorizontal size={14} /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field w-auto text-sm bg-background"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`${filtersOpen ? "fixed inset-0 z-50 bg-background p-6 overflow-auto" : "hidden"} md:block md:static md:w-60 md:shrink-0`}>
            <div className="flex items-center justify-between md:hidden mb-6">
              <h3 className="font-display text-lg font-semibold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground block mb-2">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="input-field"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground block mb-2">Category</label>
              <div className="space-y-2">
                {["", "women", "men", "kids"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`block text-sm w-full text-left py-1 transition-colors ${category === c ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {c ? c.charAt(0).toUpperCase() + c.slice(1) : "All"}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground block mb-2">
                Price: ${priceRange[0]} – ${priceRange[1]}
              </label>
              <input
                type="range"
                min={0}
                max={300}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-primary"
              />
            </div>

            {/* Size */}
            <div className="mb-6">
              <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground block mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`w-10 h-10 text-xs font-medium border transition-colors ${selectedSizes.includes(s) ? "bg-foreground text-background border-foreground" : "border-border text-foreground hover:border-foreground"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-6">
              <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground block mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleColor(c)}
                    className={`text-xs px-3 py-1.5 border transition-colors ${selectedColors.includes(c) ? "bg-foreground text-background border-foreground" : "border-border text-foreground hover:border-foreground"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-primary underline">Clear all filters</button>
            )}

            <button onClick={() => setFiltersOpen(false)} className="md:hidden btn-primary w-full mt-6">
              Show {filtered.length} results
            </button>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {loading ? (
              <ProductGridSkeleton count={6} />
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
                <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
