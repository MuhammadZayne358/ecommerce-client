import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { Product, PagedResponse } from "../../types/product";
import { deleteProduct, getAdminProducts } from "../../api/productApi";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PagedResponse<Product> | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProducts = async (page = currentPage, searchValue = search) => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminProducts(page, 10, searchValue || undefined);

      setProducts(data.data);
      setPagination(data);
    } catch (error) {
      console.error(error);

      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(1, "");
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    setCurrentPage(1);
    loadProducts(1, search);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadProducts(page, search);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteProduct(id);

      await loadProducts(currentPage, search);
    } catch (error) {
      console.error(error);

      alert("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && products.length === 0 && !pagination) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={35} className="animate-spin text-violet-600" />

          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 sm:text-4xl">
            Products
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your store products.
          </p>
        </div>

        <Link
          to="/admin/products/create"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
        >
          <Plus size={18} aria-hidden="true" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
            aria-hidden="true"
          />

          <label htmlFor="admin-product-search" className="sr-only">
            Search products
          </label>

          <input
            id="admin-product-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-violet-100 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
        >
          Search
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div
        className={`overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition ${
          loading ? "opacity-60" : ""
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-violet-100 bg-violet-50/60">
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Package
                      size={45}
                      className="mx-auto text-violet-200"
                      aria-hidden="true"
                    />

                    <p className="mt-4 text-gray-500">No products found.</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const imageUrl = product.imageUrl
                    ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}${product.imageUrl}`
                    : "https://placehold.co/100x100?text=No+Image";

                  const lowStock =
                    product.stockQuantity > 0 && product.stockQuantity <= 5;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-violet-50 transition last:border-0 hover:bg-violet-50/40"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-14 w-14 shrink-0 rounded-xl bg-violet-50 object-cover"
                          />

                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>

                            <p className="mt-1 max-w-[250px] truncate text-sm text-gray-500">
                              {product.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.categoryName}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-semibold text-violet-700">
                        ${product.price.toFixed(2)}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stockQuantity === 0
                              ? "text-rose-600"
                              : lowStock
                                ? "text-amber-600"
                                : "text-gray-800"
                          }`}
                        >
                          {product.stockQuantity}
                        </span>

                        {product.stockQuantity === 0 && (
                          <p className="text-xs text-rose-500">Out of stock</p>
                        )}

                        {lowStock && (
                          <p className="text-xs text-amber-600">Low stock</p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>

                        {product.isActive && !product.categoryIsActive && (
                          <p className="mt-1 text-xs text-amber-600">
                            Hidden (category inactive)
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="rounded-full border border-violet-200 p-2 text-violet-700 transition hover:bg-violet-600 hover:text-white"
                            title="Edit Product"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={17} />
                          </Link>

                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            className="rounded-full border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            title="Delete Product"
                            aria-label={`Delete ${product.name}`}
                          >
                            {deletingId === product.id ? (
                              <LoaderCircle size={17} className="animate-spin" />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Page{" "}
            <span className="font-semibold text-violet-700">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-violet-700">
              {pagination.totalPages}
            </span>{" "}
            ({pagination.totalCount} products)
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="flex items-center gap-1 rounded-full border border-violet-200 bg-white px-5 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-violet-700"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Previous
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-1 rounded-full border border-violet-200 bg-white px-5 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-violet-700"
            >
              Next
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;