import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye } from "lucide-react";
import { getMyOrderById } from "../../api/orderApi";
import type { Order } from "../../types/order";

function OrderSuccess() {
  const { id } = useParams();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (!id) return;

        const data = await getMyOrderById(Number(id));

        setOrder(data);
      } catch (error) {
        // Order load na ho to bhi page chalega, sirf details nahi dikhengi
        console.error(error);
      }
    };

    loadOrder();
  }, [id]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-violet-100 via-violet-50 to-white px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-violet-100 bg-white p-8 text-center shadow-xl shadow-violet-100/60 sm:p-10">
        <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={56} aria-hidden="true" />
        </span>

        <h1 className="mt-6 font-serif text-3xl font-semibold text-gray-800">
          Order Placed Successfully!
        </h1>

        <p className="mt-4 text-gray-500">
          Thank you for shopping with Aura Scents. Your order has been created
          successfully.
        </p>

        {/* Order details */}
        <div className="mt-8 space-y-3 rounded-2xl bg-violet-50/70 p-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Order Number</span>

            <span className="break-all text-right font-semibold text-gray-800">
              {order ? order.orderNumber : `#${id}`}
            </span>
          </div>

          {order && (
            <>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Payment</span>

                <span className="font-medium text-gray-800">
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : order.paymentMethod}{" "}
                  ·{" "}
                  <span
                    className={
                      order.paymentStatus === "Paid"
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }
                  >
                    {order.paymentStatus}
                  </span>
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t border-violet-100 pt-3">
                <span className="font-medium text-gray-800">Total</span>

                <span className="text-lg font-bold text-violet-700">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to={`/orders/${id}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
          >
            <Eye size={18} aria-hidden="true" />
            View Order
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200 px-6 py-3 font-medium text-violet-700 transition hover:bg-violet-50"
          >
            Continue Shopping
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;