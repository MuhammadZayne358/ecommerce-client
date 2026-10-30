import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, LoaderCircle, Package } from "lucide-react";
import { cancelOrder, getMyOrders } from "../../api/orderApi";
import type { Order } from "../../types/order";

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
      return "text-emerald-600";
    case "Refunded":
      return "text-blue-600";
    case "Failed":
      return "text-rose-600";
    default:
      return "text-amber-600";
  }
};

function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      setError("");

      const data = await getMyOrders();

      setOrders(data);
    } catch (error) {
      console.error(error);

      setError("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(id);

      await cancelOrder(id);
      await loadOrders();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-gray-500">
        <LoaderCircle size={35} className="animate-spin text-violet-600" />
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 text-violet-600">
          <Package size={44} aria-hidden="true" />
        </span>

        <h1 className="mt-6 font-serif text-3xl font-semibold text-gray-800">
          No Orders Yet
        </h1>

        <p className="mt-3 text-gray-500">
          You haven't placed any orders yet.
        </p>

        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-600 px-7 py-3.5 font-medium text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800"
        >
          Start Shopping
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-violet-50/40">
      {/* Page header */}
      <section className="bg-gradient-to-br from-violet-100 via-violet-50 to-white">
        <div className="mx-auto w-full max-w-[1600px] px-3 py-12 text-center sm:px-5 lg:px-8">
          <h1 className="font-serif text-4xl font-semibold text-gray-800 md:text-5xl">
            My Orders
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            <Link to="/" className="transition hover:text-violet-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-violet-700">My Orders</span>
          </p>
        </div>
      </section>

<div className="mx-auto w-full max-w-7xl px-3 py-10 sm:px-5 lg:px-8">
          <p className="mb-6 text-sm text-gray-500">
          <span className="font-semibold text-violet-700">
            {orders.length}
          </span>{" "}
          order{orders.length !== 1 ? "s" : ""} placed
        </p>

        <div className="space-y-4">
          {orders.map((order) => {
            const itemCount = order.items.reduce(
              (total, item) => total + item.quantity,
              0
            );

            return (
              <div
                key={order.id}
className="w-full rounded-2xl border border-violet-100 bg-white p-4 shadow-sm transition hover:shadow-md hover:shadow-violet-100 sm:p-6"              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  {/* Order info */}
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                      <Package size={22} aria-hidden="true" />
                    </span>

                    <div>
                      <h2 className="font-semibold text-gray-800">
                        Order #{order.orderNumber || order.id}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                        {itemCount} item{itemCount !== 1 ? "s" : ""}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {order.paymentMethod} ·{" "}
                        <span
                          className={`font-medium ${getPaymentClass(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <span
                      className={`w-fit rounded-full px-4 py-1.5 text-sm font-semibold ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <div className="text-left sm:min-w-24 sm:text-right">
                      <p className="text-xs text-gray-500">Total</p>

                      <p className="text-xl font-bold text-violet-700">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {order.status === "Pending" && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancellingId === order.id}
                          className="rounded-full border border-rose-200 px-5 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {cancellingId === order.id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      )}

                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
                      >
                        <Eye size={16} aria-hidden="true" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;