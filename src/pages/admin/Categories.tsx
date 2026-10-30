import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteCategory, getAdminCategories } from "../../api/categoryApi";
import {
  LoaderCircle,
  Package,
  Pencil,
  Plus,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import type { Category } from "../../types/category";

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadCategories = async () => {
    try {
      setError("");

      const data = await getAdminCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);

      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteCategory(id);

      await loadCategories();
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message || "Failed to delete category.";

      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={35} className="animate-spin text-violet-600" />

          <p className="text-gray-500">Loading categories...</p>
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
            Categories
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your product categories.
          </p>
        </div>

        <Link
          to="/admin/categories/create"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
        >
          <Plus size={18} aria-hidden="true" />
          Add Category
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="shrink-0 rounded-full p-1 transition hover:bg-red-100"
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="border-b border-violet-100 bg-violet-50/60">
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Products</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Tags
                      size={45}
                      className="mx-auto text-violet-200"
                      aria-hidden="true"
                    />

                    <p className="mt-4 text-gray-500">No categories found.</p>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-violet-50 transition last:border-0 hover:bg-violet-50/40"
                  >
                    {/* Category */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                          <Tags size={18} aria-hidden="true" />
                        </span>

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">
                            {category.name}
                          </p>

                          <p className="mt-1 max-w-[350px] truncate text-sm text-gray-500">
                            {category.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Product count */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Package
                          size={17}
                          className="text-violet-400"
                          aria-hidden="true"
                        />

                        <span className="font-medium text-gray-800">
                          {category.productCount}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          category.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-6 py-5 text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/categories/edit/${category.id}`}
                          className="rounded-full border border-violet-200 p-2 text-violet-700 transition hover:bg-violet-600 hover:text-white"
                          title="Edit Category"
                          aria-label={`Edit ${category.name}`}
                        >
                          <Pencil size={17} />
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(category.id, category.name)
                          }
                          disabled={deletingId === category.id}
                          className="rounded-full border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete Category"
                          aria-label={`Delete ${category.name}`}
                        >
                          {deletingId === category.id ? (
                            <LoaderCircle size={17} className="animate-spin" />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Categories;