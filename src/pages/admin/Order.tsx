import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  LoaderCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import type { Order } from "../../types/order";
import type { PagedResponse } from "../../types/product";
import { getAdminOrders } from "../../api/orderApi";

const statusOptions = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

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

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PagedResponse<Order> | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async (page = currentPage, status = statusFilter) => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrders(page, 10, status || undefined);

      setOrders(data.data);
      setPagination(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1, "");
  }, []);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    setStatusFilter(value);
    setCurrentPage(1);
    loadOrders(1, value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadOrders(page, statusFilter);
  };

  if (loading && orders.length === 0 && !pagination) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={35} className="animate-spin text-violet-600" />

          <p className="text-gray-500">Loading orders...</p>
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
            Orders
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage customer orders and order status.
          </p>
        </div>

        <div className="flex gap-3">
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusChange}
            className="rounded-full border border-violet-200 bg-white px-5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          >
            <option value="">All Statuses</option>

            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            onClick={() => loadOrders(currentPage, statusFilter)}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-5 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
              aria-hidden="true"
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div
        className={`overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition ${
          loading ? "opacity-60" : ""
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="border-b border-violet-100 bg-violet-50/60">
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-6 py-4 font-semibold">Order</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Items</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <ShoppingBag
                      size={45}
                      className="mx-auto text-violet-200"
                      aria-hidden="true"
                    />

                    <p className="mt-4 text-gray-500">No orders found.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-violet-50 transition last:border-0 hover:bg-violet-50/40"
                  >
                    {/* Order */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {order.userName || order.shippingFullName}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {order.userEmail}
                      </p>

                      <p className="text-xs text-gray-400">
                        Ship to: {order.shippingFullName} ·{" "}
                        {order.shippingPhone}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 font-semibold text-violet-700">
                      ${order.totalAmount.toFixed(2)}
                    </td>

                    {/* Payment */}
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-500">
                        {order.paymentMethod}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentClass(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="inline-flex items-center gap-2 rounded-full border border-violet-200 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-600 hover:text-white"
                      >
                        <Eye size={16} aria-hidden="true" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Page{" "}
            <span className="font-semibold text-violet-700">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-violet-700">
              {pagination.totalPages}
            </span>{" "}
            ({pagination.totalCount} orders)
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="flex items-center gap-1 rounded-full border border-violet-200 bg-white px-5 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-violet-700"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Previous
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-1 rounded-full border border-violet-200 bg-white px-5 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-violet-700"
            >
              Next
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;