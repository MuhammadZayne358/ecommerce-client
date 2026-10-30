import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  DollarSign,
  LoaderCircle,
  Package,
  RefreshCw,
  ShoppingBag,
  Tags,
  Users,
} from "lucide-react";
import type { AdminDashboard } from "../../types/admin";
import { getAdminDashboard } from "../../api/adminDashboardApi";
import { useAuth } from "../../context/AuthContext";

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

function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getAdminDashboard();

      setDashboard(data);
      setUpdatedAt(new Date());
    } catch (error) {
      console.error(error);

      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={35} className="animate-spin text-violet-600" />

          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-violet-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-rose-600">
            Something went wrong
          </h2>

          <p className="mt-3 text-gray-500">
            {error || "Failed to load dashboard."}
          </p>

          <button
            onClick={() => loadDashboard()}
            className="mt-6 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statistics = [
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      icon: Package,
      to: "/admin/products",
    },
    {
      title: "Categories",
      value: dashboard.totalCategories,
      icon: Tags,
      to: "/admin/categories",
    },
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      icon: Users,
      to: null,
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      icon: ShoppingBag,
      to: "/admin/orders",
    },
  ];

  const orderStatistics = [
    {
      title: "Pending",
      value: dashboard.pendingOrders,
      bar: "bg-amber-400",
    },
    {
      title: "Processing",
      value: dashboard.processingOrders,
      bar: "bg-violet-500",
    },
    {
      title: "Shipped",
      value: dashboard.shippedOrders,
      bar: "bg-indigo-500",
    },
    {
      title: "Delivered",
      value: dashboard.deliveredOrders,
      bar: "bg-emerald-500",
    },
    {
      title: "Cancelled",
      value: dashboard.cancelledOrders,
      bar: "bg-rose-400",
    },
  ];

  const trackedOrders = orderStatistics.reduce(
    (total, item) => total + item.value,
    0
  );

  const averageOrder =
    dashboard.totalOrders > 0
      ? dashboard.totalRevenue / dashboard.totalOrders
      : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 sm:text-4xl">
            Welcome Back,{" "}
            <span className="text-violet-600">
              {user?.fullName?.split(" ")[0] ?? "Admin"}
            </span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Overview of your store.
            {updatedAt && (
              <>
                {" "}
                Last updated at{" "}
                {updatedAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                .
              </>
            )}
          </p>
        </div>

        <button
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200 bg-white px-5 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-50 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
            aria-hidden="true"
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Revenue + order status */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue */}
        <div className="rounded-3xl bg-gradient-to-br from-violet-700 via-violet-800 to-slate-900 p-7 text-white shadow-lg shadow-violet-200 lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <DollarSign size={24} aria-hidden="true" />
            </span>

            <p className="text-sm font-medium text-violet-100">
              Total Revenue
            </p>
          </div>

          <h2 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
            ${dashboard.totalRevenue.toFixed(2)}
          </h2>

          <p className="mt-3 text-sm text-violet-200">
            Revenue from all non-cancelled orders.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/15 pt-6">
            <div>
              <p className="text-xs text-violet-200">Total Orders</p>

              <p className="mt-1 text-2xl font-semibold">
                {dashboard.totalOrders}
              </p>
            </div>

            <div>
              <p className="text-xs text-violet-200">Average Order</p>

              <p className="mt-1 text-2xl font-semibold">
                ${averageOrder.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Order overview */}
        <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-gray-900">
            Order Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current status of all orders.
          </p>

          <div className="mt-6 space-y-4">
            {orderStatistics.map((item) => {
              const percent =
                trackedOrders > 0 ? (item.value / trackedOrders) * 100 : 0;

              return (
                <div key={item.title}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.title}</span>

                    <span className="font-semibold text-gray-900">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-violet-50">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.bar}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main statistics */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          const card = (
            <div className="group h-full rounded-2xl border border-violet-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>

                  <h2 className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </h2>
                </div>

                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                  <Icon size={24} aria-hidden="true" />
                </span>
              </div>
            </div>
          );

          return stat.to ? (
            <Link key={stat.title} to={stat.to} className="block">
              {card}
            </Link>
          ) : (
            <div key={stat.title}>{card}</div>
          );
        })}
      </div>

      {/* Recent orders */}
      <div className="mt-6 rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Clock size={22} aria-hidden="true" />
            </span>

            <div>
              <h2 className="font-serif text-xl font-semibold text-gray-900">
                Recent Orders
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Latest 10 customer orders.
              </p>
            </div>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-700 transition hover:gap-3 hover:text-violet-900"
          >
            View All Orders
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {dashboard.recentOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No orders available yet.
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-violet-100 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="pb-4 font-semibold">Order Number</th>
                  <th className="pb-4 font-semibold">Customer</th>
                  <th className="pb-4 font-semibold">Amount</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold">Date</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-violet-50 transition last:border-0 hover:bg-violet-50/50"
                  >
                    <td className="py-4 text-sm font-semibold text-gray-900">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="transition hover:text-violet-700"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>

                    <td className="py-4 text-sm text-gray-700">
                      {order.customerName}
                    </td>

                    <td className="py-4 text-sm font-semibold text-violet-700">
                      ${order.totalAmount.toFixed(2)}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;