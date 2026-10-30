import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Category } from "../../types/category";
import type { Product, UpdateProductData } from "../../types/product";
import { getAdminProductById, updateProduct } from "../../api/productApi";
import { getAdminCategories } from "../../api/categoryApi";
import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  RotateCcw,
  Save,
  UploadCloud,
} from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const inputClass =
  "w-full rounded-xl border border-violet-100 bg-violet-50/40 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100";

const labelClass = "mb-2 block text-sm font-medium text-gray-800";

const getImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "";
  const baseUrl = apiUrl.replace("/api", "");

  return `${baseUrl}${imageUrl}`;
};

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const productId = Number(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Nayi chuni hui image ka preview (khali ho to purani image dikhegi)
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [formData, setFormData] = useState<UpdateProductData>({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    categoryId: 0,
    isActive: true,
    image: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!productId || productId <= 0) {
          setError("Invalid product ID.");
          return;
        }

        // Admin categories: inactive category wale products ke liye bhi
        // sahi category select nazar aaye
        const [productData, categoriesData] = await Promise.all([
          getAdminProductById(productId),
          getAdminCategories(),
        ]);

        setProduct(productData);
        setCategories(categoriesData);

        setFormData({
          name: productData.name,
          description: productData.description || "",
          price: productData.price,
          stockQuantity: productData.stockQuantity,
          categoryId: productData.categoryId,
          isActive: productData.isActive,
          image: null,
        });
      } catch (err) {
        console.error(err);

        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId]);

  // Preview ki memory khali karein
  useEffect(() => {
    return () => {
      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview);
      }
    };
  }, [newImagePreview]);

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

    setNewImagePreview(URL.createObjectURL(file));
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

  // Nayi image hata kar purani wapas
  const undoNewImage = () => {
    setFormData((previous) => ({
      ...previous,
      image: null,
    }));

    setNewImagePreview(null);
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

      await updateProduct(productId, {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      navigate("/admin/products");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message || "Failed to update product.";

      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={35} className="animate-spin text-violet-600" />

          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl">
        <Link
          to="/admin/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-violet-700 transition hover:text-violet-900"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Products
        </Link>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-600">
          {error || "Product not found."}
        </div>
      </div>
    );
  }

  const currentImage = newImagePreview ?? getImageUrl(product.imageUrl);

  const selectedCategory = categories.find(
    (category) => category.id === formData.categoryId
  );

  const categoryInactive = selectedCategory && !selectedCategory.isActive;

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
          Edit Product
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Update your product information.
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
              {currentImage ? (
                <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/50">
                  <img
                    src={currentImage}
                    alt="Product preview"
                    className="h-[320px] w-full object-contain"
                  />

                  {newImagePreview && (
                    <span className="absolute left-3 top-3 rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white shadow-md">
                      New image
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                    <label
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-md transition ${
                        dragging
                          ? "bg-violet-800 text-white"
                          : "bg-violet-600 text-white hover:bg-violet-700"
                      }`}
                    >
                      <UploadCloud size={16} aria-hidden="true" />
                      Change Image

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    {newImagePreview && (
                      <button
                        type="button"
                        onClick={undoNewImage}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition hover:bg-gray-100"
                      >
                        <RotateCcw size={16} aria-hidden="true" />
                        Keep Old Image
                      </button>
                    )}
                  </div>
                </div>
              ) : (
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
                    <ImagePlus size={30} aria-hidden="true" />
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
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                      {!category.isActive ? " (inactive)" : ""}
                    </option>
                  ))}
                </select>

                {categoryInactive && (
                  <p className="mt-2 text-xs text-amber-600">
                    This category is inactive, so the product stays hidden from
                    customers.
                  </p>
                )}
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
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between gap-4 rounded-xl border border-violet-100 bg-violet-50/40 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Product Status
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {formData.isActive
                      ? "This product is visible to customers."
                      : "This product is hidden from customers."}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.isActive}
                  aria-label="Product active status"
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      isActive: !previous.isActive,
                    }))
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    formData.isActive ? "bg-violet-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      formData.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
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
                Updating...
              </>
            ) : (
              <>
                <Save size={18} aria-hidden="true" />
                Update Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;