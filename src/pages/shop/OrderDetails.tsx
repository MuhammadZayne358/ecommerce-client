import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Order } from "../../types/order";
import { cancelOrder, getMyOrderById } from "../../api/orderApi";
import {
  ArrowLeft,
  CreditCard,
  LoaderCircle,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";

const getStatusClass = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-700";
    case "Confirmed":
      return "bg-blue-100 text-blue-700";
    case "Processing":
      return "bg-violet-100 text-violet-700";
    case "Shipped":
      return "bg-indigo-100 text-indigo-700";
    case "Delivered":
      return "bg-emerald-100 text-emerald-700";
    case "Cancelled":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentClass = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-emerald-100 text-emerald-700";
    case "Refunded":
      return "bg-blue-100 text-blue-700";
    case "Failed":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
};

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const loadOrder = async () => {
    try {
      if (!id) return;

      setError("");

      const data = await getMyOrderById(Number(id));

      setOrder(data);
    } catch (error) {
      console.error(error);

      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      await cancelOrder(order.id);
      await loadOrder();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-gray-500">
        <LoaderCircle size={35} className="animate-spin text-violet-600" />
        Loading order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5">
        <p className="rounded-2xl border border-red-100 bg-red-50 px-6 py-4 text-red-600">
          {error || "Order not found."}
        </p>

        <Link
          to="/orders"
          className="rounded-full bg-violet-600 px-6 py-2.5 font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-violet-50/40">
      {/* Page header */}
      <section className="bg-gradient-to-br from-violet-100 via-violet-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="font-serif text-4xl font-semibold text-gray-800 md:text-5xl">
            Order Details
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            <Link to="/" className="transition hover:text-violet-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/orders" className="transition hover:text-violet-700">
              My Orders
            </Link>
            <span className="mx-2">/</span>
            <span className="text-violet-700">
              #{order.orderNumber || order.id}
            </span>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-violet-700 transition hover:text-violet-900"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to My Orders
        </Link>

        {/* Order header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Order #{order.orderNumber || order.id}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-5 py-2 text-sm font-semibold ${getStatusClass(
                order.status
              )}`}
            >
              {order.status}
            </span>

            {order.status === "Pending" && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="rounded-full border border-rose-200 px-5 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order items */}
            <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Package size={20} aria-hidden="true" />
                </span>

                <h2 className="font-serif text-xl font-semibold text-gray-800">
                  Order Items
                </h2>
              </div>

              <div className="mt-6 space-y-5">
                {order.items.map((item) => {
                  const imageUrl = item.imageUrl
                    ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}${item.imageUrl}`
                    : "https://placehold.co/200x200?text=No+Image";

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-violet-50 pb-5 last:border-0 last:pb-0"
                    >
                      <img
                        src={imageUrl}
                        alt={item.productName}
                        className="h-20 w-20 shrink-0 rounded-xl bg-violet-50 object-cover"
                      />

                      <div className="flex flex-1 justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {item.productName}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            ${item.unitPrice.toFixed(2)} × {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold text-violet-700">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer information */}
            <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-gray-800">
                Customer Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                    <User size={18} aria-hidden="true" />
                  </span>

                  <div>
                    <p className="text-xs text-gray-500">Name</p>

                    <p className="font-medium text-gray-800">
                      {order.shippingFullName}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                    <Phone size={18} aria-hidden="true" />
                  </span>

                  <div>
                    <p className="text-xs text-gray-500">Phone</p>

                    <p className="font-medium text-gray-800">
                      {order.shippingPhone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Shipping */}
            <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <MapPin size={20} aria-hidden="true" />
                </span>

                <h2 className="font-serif text-xl font-semibold text-gray-800">
                  Shipping Address
                </h2>
              </div>

              <div className="mt-5 text-sm leading-6 text-gray-600">
                <p>{order.shippingAddress}</p>
                <p>{order.shippingCity}</p>
                <p>{order.shippingPostalCode}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <CreditCard size={20} aria-hidden="true" />
                </span>

                <h2 className="font-serif text-xl font-semibold text-gray-800">
                  Payment
                </h2>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Method</span>

                  <span className="font-medium text-gray-800">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : order.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status</span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentClass(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 p-6 text-white shadow-lg shadow-violet-200">
              <div className="space-y-2 text-sm text-violet-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${order.shippingFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-white/20 pt-4">
                <p className="text-sm text-violet-200">Order Total</p>

                <p className="mt-1 text-3xl font-bold">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;