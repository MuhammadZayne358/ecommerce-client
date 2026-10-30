import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createCategory } from "../../api/categoryApi";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-violet-100 bg-violet-50/40 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100";

const labelClass = "mb-2 block text-sm font-medium text-gray-800";

function CreateCategory() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSubmitting(true);

      await createCategory({
        name: name.trim(),
        description: description.trim(),
      });

      navigate("/admin/categories");
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message || "Failed to create category.";

      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back */}
      <Link
        to="/admin/categories"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-violet-700 transition hover:text-violet-900"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Categories
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-gray-900 sm:text-4xl">
          Add Category
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create a new product category.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-xl font-semibold text-gray-900">
            Category Details
          </h2>

          <div className="mt-6 space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className={labelClass}>
                Category Name <span className="text-pink-500">*</span>
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Electronics"
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClass}>
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={6}
                placeholder="Enter category description"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/admin/categories"
            className="rounded-full border border-violet-200 px-7 py-3 text-center text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-full bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save size={18} aria-hidden="true" />
                Create Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCategory;