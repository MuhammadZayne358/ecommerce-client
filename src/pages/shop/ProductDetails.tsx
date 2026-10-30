import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Product } from "../../types/product";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getProductById } from "../../api/productApi";
import {
  Check,
  LoaderCircle,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
} from "lucide-react";
import ProductReviews from "../../components/reviews/Productreviews";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [cartError, setCartError] = useState("");
  const [cartSuccess, setCartSuccess] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) return;

        setLoading(true);
        setError("");
        setQuantity(1);

        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-gray-500">
        <LoaderCircle size={35} className="animate-spin text-violet-600" />
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5">
        <p className="rounded-2xl border border-red-100 bg-red-50 px-6 py-4 text-red-600">
          {error || "Product not found."}
        </p>

        <Link
          to="/products"
          className="rounded-full bg-violet-600 px-6 py-2.5 font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const imageUrl = product.imageUrl
    ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}${product.imageUrl}`
    : "https://placehold.co/600x600?text=No+Image";

  const inStock = product.stockQuantity > 0;

  const increaseQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      setCartError("");
      setCartSuccess("");

      await addToCart(product.id, quantity);

      setCartSuccess("Product added to your cart.");
    } catch (error: any) {
      console.error(error);

      setCartError(
        error?.response?.data?.message || "Failed to add product to cart.",
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setBuyingNow(true);
      setCartError("");
      setCartSuccess("");

      await addToCart(product.id, quantity);

      navigate("/checkout");
    } catch (error: any) {
      console.error(error);

      setCartError(
        error?.response?.data?.message || "Failed to process your request.",
      );
      setBuyingNow(false);
    }
  };

  const busy = addingToCart || buyingNow;

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <section className="bg-gradient-to-br from-violet-100 via-violet-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="font-serif text-4xl font-semibold text-gray-800 md:text-5xl">
            Shop Details
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            <Link to="/" className="transition hover:text-violet-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="transition hover:text-violet-700">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="text-violet-700">{product.name}</span>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 shadow-lg shadow-violet-100/60">
            <img
              src={imageUrl}
              alt={product.name}
              className="aspect-square w-full rounded-2xl object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {product.categoryName && (
              <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
                {product.categoryName}
              </p>
            )}

            <h2 className="mt-2 font-serif text-4xl font-semibold leading-tight text-gray-800 md:text-5xl">
              {product.name}
            </h2>

            <div className="mt-5">
              {inStock ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-medium text-white">
                  <Check size={16} aria-hidden="true" />
                  In Stock ({product.stockQuantity} available)
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-rose-500 px-4 py-1.5 text-sm font-medium text-white">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="mt-6 text-sm font-medium text-gray-500">Price</p>
            <p className="mt-1 text-4xl font-bold text-violet-700 sm:text-5xl">
              ${product.price.toFixed(2)}
            </p>
            {inStock && (
              <>
                {/* Quantity + buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <div className="inline-flex items-center justify-between gap-2 rounded-full border border-violet-200 bg-white p-1.5 sm:justify-start">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="rounded-full p-3 text-violet-700 transition hover:bg-violet-100 disabled:opacity-40"
                    >
                      <Minus size={18} />
                    </button>

                    <span className="w-10 text-center font-semibold text-gray-800">
                      {quantity}
                    </span>

                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stockQuantity}
                      aria-label="Increase quantity"
                      className="rounded-full p-3 text-violet-700 transition hover:bg-violet-100 disabled:opacity-40"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={busy}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {addingToCart ? (
                      <LoaderCircle size={20} className="animate-spin" />
                    ) : (
                      <ShoppingCart size={20} />
                    )}
                    {addingToCart ? "Adding..." : "Add To Cart"}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={busy}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-pink-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {buyingNow ? (
                      <LoaderCircle size={20} className="animate-spin" />
                    ) : (
                      <Zap size={20} />
                    )}
                    {buyingNow ? "Please wait..." : "Buy Now"}
                  </button>
                </div>

                {cartError && (
                  <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {cartError}
                  </p>
                )}

                {cartSuccess && (
                  <p className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {cartSuccess}
                    <Link
                      to="/cart"
                      className="font-semibold underline underline-offset-2"
                    >
                      View Cart
                    </Link>
                  </p>
                )}
              </>
            )}

            {/* Meta */}
            <div className="mt-8 space-y-3 border-y border-violet-100 py-6 text-sm">
              <p>
                <span className="font-semibold text-gray-800">Category:</span>{" "}
                <span className="text-gray-500">
                  {product.categoryName || "-"}
                </span>
              </p>

              <p>
                <span className="font-semibold text-gray-800">
                  Availability:
                </span>{" "}
                <span className="text-gray-500">
                  {inStock ? "Available" : "Currently unavailable"}
                </span>
              </p>
            </div>

            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex rounded-full border border-violet-200 px-6 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-600 hover:text-white"
              >
                Go to Shop
              </Link>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-16">
          <div className="border-b border-violet-100">
            <span className="inline-block border-b-2 border-violet-600 pb-3 text-lg font-medium text-violet-700">
              Description
            </span>
          </div>

          <p className="mt-6 max-w-3xl leading-8 text-gray-600">
            {product.description ||
              "No description available for this product."}
          </p>
            <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
