import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Order } from "../../types/order";
import {
  getAdminOrderById,
  markOrderAsPaid,
  UpdateOrderStatus,
} from "../../api/orderApi";
import {
  ArrowLeft,
  Check,
  CreditCard,
  LoaderCircle,
  MapPin,
  Package,
  Save,
} from "lucide-react";

const allowedTransitions: Record<string, string[]> = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

const getStatusClass = (value: string) => {
  switch (value) {
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

const OrderDetailsAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Silent reload: page ghayab nahi hota
  const loadOrder = async () => {
    if (!id) {
      setError("Invalid order Id.");
      setLoading(false);
      return;
    }

    try {
      const data = await getAdminOrderById(Number(id));

      setOrder(data);
      setStatus(data.status);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    setSuccess("");
    loadOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!order || !id) return;

    if (status === order.status) {
      setSuccess("Order status is already up to date.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await UpdateOrderStatus(Number(id), status);

      // Dobara load: cancel par payment "Refunded" bhi nazar aaye
      await loadOrder();

      setSuccess("Order status updated successfully.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update order status.");
      setStatus(order.status);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!order || !id) return;

    const confirmed = window.confirm("Mark this order as paid?");
    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await markOrderAsPaid(Number(id));
      await loadOrder();

      setSuccess("Payment marked as paid.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update payment.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={35} className="animate-spin text-violet-600" />

          <p className="text-gray-500">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-violet-100 bg-white p-8 text-center shadow-sm">
          <p className="text-rose-600">{error || "Order not found."}</p>

          <button
            onClick={() => navigate("/admin/orders")}
            className="mt-5 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const isLocked = order.status === "Delivered" || order.status === "Cancelled";

  const availableStatuses = [
    order.status,
    ...(allowedTransitions[order.status] ?? []),
  ];

  const canMarkAsPaid =
    order.paymentMethod === "COD" &&
    order.paymentStatus === "Pending" &&
    order.status !== "Cancelled";

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            onClick={() => navigate("/admin/orders")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-violet-700 transition hover:text-violet-900"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Orders
          </button>

          <h1 className="font-serif text-3xl font-semibold text-gray-900 sm:text-4xl">
            Order Details
          </h1>

          <p className="mt-2 text-sm text-gray-500">{order.orderNumber}</p>
        </div>

        <span
          className={`w-fit rounded-full px-5 py-2 text-sm font-semibold ${getStatusClass(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          <Check size={16} aria-hidden="true" />
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          {/* Shipping information */}
          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <MapPin size={20} aria-hidden="true" />
              </span>

              <h2 className="font-serif text-xl font-semibold text-gray-900">
                Shipping Information
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Customer Account
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {order.userName || "-"}
                </p>
                <p className="text-xs text-gray-500">{order.userEmail}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Ship To
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {order.shippingFullName}
                </p>
                <p className="text-xs text-gray-500">{order.shippingPhone}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Address
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {order.shippingAddress}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  City
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {order.shippingCity}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Postal Code
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {order.shippingPostalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Package size={20} aria-hidden="true" />
                </span>

                <h2 className="font-serif text-xl font-semibold text-gray-900">
                  Order Items
                </h2>
              </div>

              <span className="text-sm text-gray-500">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-violet-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-violet-50">
                    {item.imageUrl ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL?.replace("/api", "")}${item.imageUrl}`}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-violet-300">
                        <Package size={28} aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.productName}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Product ID: {item.productId}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      ${item.unitPrice.toFixed(2)} × {item.quantity}
                    </p>
                  </div>

                  <div className="font-semibold text-violet-700">
                    ${item.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Update status */}
          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-serif text-xl font-semibold text-gray-900">
              Update Status
            </h2>

            <label htmlFor="order-status" className="sr-only">
              Order status
            </label>

            <select
              id="order-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isLocked || saving}
              className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:bg-gray-100"
            >
              {availableStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {isLocked && (
              <p className="mt-3 text-xs text-gray-500">
                This order cannot be changed because it is{" "}
                {order.status.toLowerCase()}.
              </p>
            )}

            {!isLocked && (
              <button
                onClick={handleStatusUpdate}
                disabled={saving || status === order.status}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Save size={17} aria-hidden="true" />
                )}
                {saving ? "Updating..." : "Update Status"}
              </button>
            )}
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <CreditCard size={20} aria-hidden="true" />
              </span>

              <h2 className="font-serif text-xl font-semibold text-gray-900">
                Payment
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Method</span>
                <span className="font-medium text-gray-900">
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500">Status</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentClass(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {canMarkAsPaid && (
                <button
                  onClick={handleMarkAsPaid}
                  disabled={saving}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check size={17} aria-hidden="true" />
                  Mark as Paid
                </button>
              )}

              <div className="flex items-center justify-between gap-4 border-t border-violet-50 pt-3">
                <span className="text-gray-500">Created</span>

                <span className="text-right font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 p-6 text-white shadow-lg shadow-violet-200">
            <h2 className="mb-4 font-serif text-xl font-semibold">
              Order Summary
            </h2>

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

            <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4">
              <span className="font-semibold">Total</span>

              <span className="text-3xl font-bold">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsAdmin;