import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { getProducts } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import type { Product } from "../../types/product";
import type { Category } from "../../types/category";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

const PAGE_SIZE = 12;

interface Filters {
  search: string;
  categoryId: number | "";
  minPrice: string;
  maxPrice: string;
}

const emptyFilters: Filters = {
  search: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
};

function Products() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("categoryId");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Sidebar ke andar jo likha ja raha hai (Apply se pehle)
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Jo filters asal mein lag chuke hain
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    categoryId: categoryFromUrl ? Number(categoryFromUrl) : "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // URL mein categoryId badle (Home page se aane par) to category select ho
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categoryId: categoryFromUrl ? Number(categoryFromUrl) : "",
    }));
    setCurrentPage(1);
  }, [categoryFromUrl]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts(
          currentPage,
          PAGE_SIZE,
          filters.search || undefined,
          filters.categoryId === "" ? undefined : filters.categoryId,
          filters.minPrice ? Number(filters.minPrice) : undefined,
          filters.maxPrice ? Number(filters.maxPrice) : undefined
        );

        setProducts(response.data);
        setTotalCount(response.totalCount);
        setTotalPages(response.totalPages);
        setHasNextPage(response.hasNextPage);
        setHasPreviousPage(response.hasPreviousPage);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, filters]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadCategories();
  }, []);

  const handleApply = (event: React.FormEvent) => {
    event.preventDefault();

    setFilters((prev) => ({
      ...prev,
      search,
      minPrice,
      maxPrice,
    }));
    setCurrentPage(1);
    setFiltersOpen(false);
  };

  const handleCategoryChange = (id: number | "") => {
    setFilters((prev) => ({ ...prev, categoryId: id }));
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setFilters(emptyFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.categoryId !== "" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "";

  const showingFrom = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(currentPage * PAGE_SIZE, totalCount);

  const inputClass =
    "w-full rounded-full border border-violet-100 bg-violet-50/50 px-4 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100";

  return (
    <div className="min-h-screen bg-violet-50/40">
      {/* Page header */}
      <section className="bg-gradient-to-br from-violet-100 via-violet-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center">
          <h1 className="font-serif text-4xl font-semibold text-gray-800 md:text-5xl">
            Our Shop
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            <Link to="/" className="transition hover:text-violet-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-violet-700">Shop</span>
          </p>
        </div>
      </section>


<div className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 2xl:px-10">
        {/* Mobile filter button */}
        <button
          onClick={() => setFiltersOpen((open) => !open)}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-full border border-violet-200 bg-white px-5 py-3 text-sm font-medium text-violet-700 lg:hidden"
        >
          {filtersOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
          {filtersOpen ? "Hide Filters" : "Show Filters"}
        </button>


<div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-8">
          {/* Sidebar */}
          <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
            <form
              onSubmit={handleApply}
              className="space-y-7 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm lg:sticky lg:top-32"
            >
              {/* Search */}
              <div>
                <label
                  htmlFor="product-search"
                  className="mb-3 block text-sm font-semibold text-gray-800"
                >
                  Search
                </label>

                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
                    aria-hidden="true"
                  />
                  <input
                    id="product-search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search perfumes..."
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="border-t border-violet-100 pt-6">
                <h2 className="mb-3 text-sm font-semibold text-gray-800">
                  Categories
                </h2>

                <div className="space-y-1">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-700 transition hover:bg-violet-50">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.categoryId === ""}
                      onChange={() => handleCategoryChange("")}
                      className="h-4 w-4 accent-violet-600"
                    />
                    All Categories
                  </label>

                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-700 transition hover:bg-violet-50"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={filters.categoryId === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        className="h-4 w-4 accent-violet-600"
                      />
                      <span className="flex-1">{category.name}</span>
                      <span className="text-xs text-gray-400">
                        {category.productCount}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-violet-100 pt-6">
                <h2 className="mb-3 text-sm font-semibold text-gray-800">
                  Price Range
                </h2>

                <div className="flex items-center gap-2">
                  <label htmlFor="min-price" className="sr-only">
                    Min price
                  </label>
                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className={inputClass}
                  />

                  <span className="text-gray-400">-</span>

                  <label htmlFor="max-price" className="sr-only">
                    Max price
                  </label>
                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
                >
                  Apply Filters
                </button>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="w-full rounded-full border border-violet-200 px-6 py-3 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </form>
          </aside>

          {/* Products */}
          <div>
            {loading ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <LoaderCircle
                  size={35}
                  className="animate-spin text-violet-600"
                />
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-violet-100 bg-white p-12 text-center">
                <p className="text-gray-500">No products found.</p>

                {hasActiveFilters && (
                  <button
                    onClick={handleClear}
                    className="mt-4 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="mb-5 text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-violet-700">
                    {showingFrom}-{showingTo}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-violet-700">
                    {totalCount}
                  </span>{" "}
                  results
                </p>


<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPreviousPage}
                      className="flex items-center gap-1 rounded-full border border-violet-200 bg-white px-5 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-violet-700"
                    >
                      <ChevronLeft size={16} aria-hidden="true" />
                      Previous
                    </button>

                    <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-800">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                      className="flex items-center gap-1 rounded-full border border-violet-200 bg-white px-5 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-violet-700"
                    >
                      Next
                      <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;