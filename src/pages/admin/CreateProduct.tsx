import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Category } from "../../types/category";
import { createdProduct } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  Save,
  UploadCloud,
  X,
} from "lucide-react";
import type { CreateProductData } from "../../types/product";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const inputClass =
  "w-full rounded-xl border border-violet-100 bg-violet-50/40 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100";

const labelClass = "mb-2 block text-sm font-medium text-gray-800";

function CreateProducts() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    categoryId: 0,
    image: null,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error(error);

        setError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Page chhorte waqt preview ki memory khali karein
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "price" || name === "stockQuantity" || name === "categoryId"
          ? Number(value)
          : value,
    }));
  };

  const selectImage = (file: File | undefined) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG or WEBP images are allowed.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size cannot exceed 5 MB.");
      return;
    }

    setError("");

    setFormData((previous) => ({
      ...previous,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectImage(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);

    selectImage(event.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setFormData((previous) => ({
      ...previous,
      image: null,
    }));

    setImagePreview(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!formData.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (formData.price < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (formData.stockQuantity < 0) {
      setError("Stock quantity cannot be negative.");
      return;
    }

    try {
      setSubmitting(true);

      await createdProduct({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      navigate("/admin/products");
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message || "Failed to create product.";

      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategories) {
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
    <div className="mx-auto max-w-6xl">
      {/* Back */}
      <Link
        to="/admin/products"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-violet-700 transition hover:text-violet-900"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Products
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-gray-900 sm:text-4xl">
          Add Product
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create a new product for your store.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Image */}
          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-xl font-semibold text-gray-900">
              Product Image
            </h2>

            <div className="mt-6">
              {!imagePreview ? (
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
                    dragging
                      ? "border-violet-500 bg-violet-50"
                      : "border-violet-200 hover:border-violet-400 hover:bg-violet-50/50"
                  }`}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    {dragging ? (
                      <UploadCloud size={30} aria-hidden="true" />
                    ) : (
                      <ImagePlus size={30} aria-hidden="true" />
                    )}
                  </span>

                  <p className="mt-5 font-medium text-gray-800">
                    Drop your image here, or{" "}
                    <span className="text-violet-600">Browse</span>
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG or WEBP. Maximum 5 MB.
                  </p>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/50">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-[320px] w-full object-contain"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 rounded-full bg-white p-2 text-rose-600 shadow-md transition hover:bg-rose-500 hover:text-white"
                    aria-label="Remove image"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Fields */}
          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-xl font-semibold text-gray-900">
              Product Details
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Product Name <span className="text-pink-500">*</span>
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="categoryId" className={labelClass}>
                  Category <span className="text-pink-500">*</span>
                </label>

                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value={0}>Select Category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className={labelClass}>
                    Price ($)
                  </label>

                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="stockQuantity" className={labelClass}>
                    Stock Quantity
                  </label>

                  <input
                    id="stockQuantity"
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Enter product description"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/admin/products"
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
                Publish Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProducts;