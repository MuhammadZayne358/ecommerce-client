import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";

function Cart() {
  const { cart, loading, updateCartItem, removeCartItem } = useCart();

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [busyItemId, setBusyItemId] = useState<number | null>(null);

  const handleQuantityChange = async (itemId: number, quantity: number) => {
    try {
      setError("");
      setBusyItemId(itemId);

      await updateCartItem(itemId, quantity);
    } catch (err: any) {
      console.error(err);

      setError(err?.response?.data?.message || "Failed to update quantity.");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleIncrease = (
    itemId: number,
    currentQuantity: number,
    stockQuantity: number
  ) => {
    if (currentQuantity >= stockQuantity) return;

    handleQuantityChange(itemId, currentQuantity + 1);
  };

  const handleDecrease = (itemId: number, currentQuantity: number) => {
    if (currentQuantity <= 1) return;

    handleQuantityChange(itemId, currentQuantity - 1);
  };

  const handleRemove = async (itemId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this item?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setBusyItemId(itemId);

      await removeCartItem(itemId);
    } catch (err) {
      console.error(err);

      setError("Failed to remove item.");
    } finally {
      setBusyItemId(null);
    }
  };

  if (loading && !cart) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-gray-500">
        <LoaderCircle size={35} className="animate-spin text-violet-600" />
        Loading cart...
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 text-violet-600">
          <ShoppingBag size={44} aria-hidden="true" />
        </span>

        <h1 className="mt-6 font-serif text-3xl font-semibold text-gray-800">
          Your cart is empty
        </h1>

        <p className="mt-3 text-gray-500">
          Looks like you haven't added anything yet.
        </p>

        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-600 px-7 py-3.5 font-medium text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800"
        >
          Continue Shopping
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  const total = cart.subTotal + cart.shippingFee;

  return (
    <div className="min-h-screen bg-violet-50/40">
      {/* Page header */}
      <section className="bg-gradient-to-br from-violet-100 via-violet-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="font-serif text-4xl font-semibold text-gray-800 md:text-5xl">
            Shopping Cart
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            <Link to="/" className="transition hover:text-violet-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-violet-700">Cart</span>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <p className="mb-6 text-sm text-gray-500">
          <span className="font-semibold text-violet-700">
            {cart.totalItems}
          </span>{" "}
          item{cart.totalItems !== 1 ? "s" : ""} in your cart
        </p>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="space-y-4 lg:col-span-2">
            {cart.items.map((item) => {
              const imageUrl = item.imageUrl
                ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}${item.imageUrl}`
                : "https://placehold.co/300x300?text=No+Image";

              const busy = busyItemId === item.cartItemId;

              return (
                <div
                  key={item.cartItemId}
                  className={`flex gap-4 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm transition sm:gap-6 sm:p-5 ${
                    busy ? "opacity-60" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-violet-50 sm:h-32 sm:w-32">
                    <img
                      src={imageUrl}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate font-serif text-lg font-semibold text-gray-800">
                          {item.productName}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          ${item.unitPrice.toFixed(2)} each
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {item.stockQuantity} in stock
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item.cartItemId)}
                        disabled={busy}
                        className="h-fit rounded-full p-2 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed"
                        title="Remove item"
                        aria-label={`Remove ${item.productName}`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity */}
                      <div className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-white p-1">
                        <button
                          onClick={() =>
                            handleDecrease(item.cartItemId, item.quantity)
                          }
                          disabled={busy || item.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="rounded-full p-2 text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-8 text-center text-sm font-semibold text-gray-800">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleIncrease(
                              item.cartItemId,
                              item.quantity,
                              item.stockQuantity
                            )
                          }
                          disabled={busy || item.quantity >= item.stockQuantity}
                          aria-label="Increase quantity"
                          className="rounded-full p-2 text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Line total */}
                      <p className="text-lg font-semibold text-violet-700">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <Link
              to="/products"
              className="inline-flex items-center gap-2 pt-2 text-sm font-medium text-violet-700 transition hover:gap-3 hover:text-violet-900"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div>
            <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm lg:sticky lg:top-32">
              <h2 className="font-serif text-2xl font-semibold text-gray-800">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 border-b border-violet-100 pb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items</span>
                  <span className="font-medium text-gray-800">
                    {cart.totalItems}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">
                    ${cart.subTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-800">
                    ${cart.shippingFee.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800">
                  Total
                </span>

                <span className="text-3xl font-bold text-violet-700">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
              >
                Proceed to Checkout
                <ArrowRight size={18} aria-hidden="true" />
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck
                  size={14}
                  className="text-violet-600"
                  aria-hidden="true"
                />
                Secure checkout. Cash on Delivery available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;