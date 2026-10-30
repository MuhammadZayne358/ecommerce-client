import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, LoaderCircle, ShoppingBag, Sparkles, Star } from "lucide-react";
import type { Product } from "../../types/product";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const imageUrl = product.imageUrl
    ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}${product.imageUrl}`
    : "https://placehold.co/600x400?text=No+Image";

  const inStock = product.stockQuantity > 0;

  const handleAddToCart = async () => {
    // Login nahi hai to login page par bhejein
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);

      await addToCart(product.id, 1);

      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (error: any) {
      console.error(error);

      alert(error?.response?.data?.message || "Failed to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-violet-50">
        <Link to={`/products/${product.id}`} className="block h-full w-full">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {product.categoryName && (
          <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-violet-700 shadow-sm backdrop-blur">
            <Sparkles size={12} aria-hidden="true" />
            {product.categoryName}
          </span>
        )}

        {!inStock && (
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-white">
            Sold Out
          </span>
        )}

        {/* Add to cart button */}
        {inStock && (
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition disabled:cursor-not-allowed ${
              added
                ? "bg-emerald-500 text-white"
                : "bg-white text-violet-700 hover:bg-violet-600 hover:text-white"
            }`}
            title="Add to cart"
            aria-label={`Add ${product.name} to cart`}
          >
            {adding ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : added ? (
              <Check size={18} />
            ) : (
              <ShoppingBag size={18} />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-1 font-serif text-lg font-semibold text-gray-800 transition hover:text-violet-600">
            {product.name}
          </h3>
        </Link>

        {product.reviewCount > 0 && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="lining-nums">
              {product.averageRating.toFixed(1)}
            </span>
            <span>({product.reviewCount})</span>
          </div>
        )}

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {product.description || "No description available."}
        </p>

        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="text-xl font-semibold text-violet-600">
            ${product.price.toFixed(2)}
          </span>

          {inStock ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
              In Stock
            </span>
          ) : (
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;