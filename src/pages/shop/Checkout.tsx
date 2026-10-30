import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowRight,
  Banknote,
  CreditCard,
  LoaderCircle,
  MapPin,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { checkout } from "../../api/orderApi";
import {
  createAddress,
  deletAddress,
  getMyAddress,
  setDefaultAddress,
} from "../../api/addressApi";
import type { Address } from "../../types/address";

const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Hyderabad",
  "Sialkot",
];

const inputClass =
  "w-full rounded-xl border border-violet-100 bg-violet-50/40 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100";

const labelClass = "mb-2 block text-sm font-medium text-gray-800";

function Checkout() {
  const navigate = useNavigate();

  const { cart, refreshCart } = useCart();
  const { user } = useAuth();

  // Name login user se auto-fill hota hai
  const [shippingFullName, setShippingFullName] = useState(
    user?.fullName ?? "",
  );
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Card">("COD");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Saved addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | "new">(
    "new",
  );
  const [saveAddress, setSaveAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fillFromAddress = (address: Address) => {
    setSelectedAddressId(address.id);
    setShippingFullName(address.fullName);
    setShippingPhone(address.phone);
    setShippingAddress(address.addressLine);
    setShippingCity(address.city);
    setShippingPostalCode(address.postalCode);
  };

  const startNewAddress = () => {
    setSelectedAddressId("new");
    setShippingFullName(user?.fullName ?? "");
    setShippingPhone("");
    setShippingAddress("");
    setShippingCity("");
    setShippingPostalCode("");
  };

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const list = await getMyAddress();
        setAddresses(list);

        const preferred = list.find((a) => a.isDefault) ?? list[0];
        if (preferred) {
          fillFromAddress(preferred);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadAddresses();
  }, []);

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress(id);
      setAddresses(await getMyAddress());
    } catch (error) {
      console.error(error);
      setError("Failed to update default address.");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await deletAddress(id);

      const list = await getMyAddress();
      setAddresses(list);

      // Jo address select tha wohi delete hua to dusra select karo
      if (selectedAddressId === id) {
        const next = list.find((a) => a.isDefault) ?? list[0];

        if (next) {
          fillFromAddress(next);
        } else {
          startNewAddress();
        }
      }
    } catch (error) {
      console.error(error);
      setError("Failed to delete address.");
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 text-violet-600">
          <ShoppingBag size={44} aria-hidden="true" />
        </span>

        <h1 className="mt-6 font-serif text-3xl font-semibold text-gray-800">
          Your cart is empty
        </h1>

        <p className="mt-3 text-gray-500">Add some products before checkout.</p>

        <button
          onClick={() => navigate("/products")}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-600 px-7 py-3.5 font-medium text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800"
        >
          Continue Shopping
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    );
  }

  const total = cart.subTotal + cart.shippingFee;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const order = await checkout({
        shippingFullName,
        shippingPhone,
        shippingAddress,
        shippingCity,
        shippingPostalCode,
        paymentMethod,
        ...(paymentMethod === "Card" && {
          cardNumber,
          cardExpiry,
          cardCvc,
        }),
      });

      // Order ho gaya, ab agar user ne kaha ho to address save kar lo.
      // Fail bhi ho jaye to order par asar nahi parna chahiye.
      if (selectedAddressId === "new" && saveAddress) {
        try {
          await createAddress({
            label: addressLabel.trim() || "Home",
            fullName: shippingFullName,
            phone: shippingPhone,
            addressLine: shippingAddress,
            city: shippingCity,
            postalCode: shippingPostalCode,
            isDefault: addresses.length === 0,
          });
        } catch (saveError) {
          console.error("Could not save address", saveError);
        }
      }

      await refreshCart();

      navigate(`/order-success/${order.id}`);
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message ??
          "Failed to place your order. Please try again.",
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  const optionClass = (selected: boolean) =>
    `flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition ${
      selected
        ? "border-violet-500 bg-violet-50"
        : "border-violet-100 bg-white hover:border-violet-300"
    }`;

  const addressCardClass = (selected: boolean) =>
    `relative flex cursor-pointer gap-3 rounded-2xl border-2 p-4 transition ${
      selected
        ? "border-violet-500 bg-violet-50"
        : "border-violet-100 bg-white hover:border-violet-300"
    }`;

  const showForm = selectedAddressId === "new";

  return (
    <div className="min-h-screen bg-violet-50/40">
      {/* Page header */}
      <section className="bg-gradient-to-br from-violet-100 via-violet-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="font-serif text-4xl font-semibold text-gray-800 md:text-5xl">
            Checkout
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            <Link to="/" className="transition hover:text-violet-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/cart" className="transition hover:text-violet-700">
              Cart
            </Link>
            <span className="mx-2">/</span>
            <span className="text-violet-700">Checkout</span>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-6 lg:col-span-2"
          >
            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Shipping details */}
            <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-serif text-2xl font-semibold text-gray-800">
                Shipping Details
              </h2>

              {/* Saved addresses */}
              {addresses.length > 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={addressCardClass(
                        selectedAddressId === address.id,
                      )}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedAddressId === address.id}
                        onChange={() => fillFromAddress(address)}
                        className="mt-1 h-4 w-4 shrink-0 accent-violet-600"
                      />

                      <span className="min-w-0 flex-1 text-sm">
                        <span className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {address.label}
                          </span>

                          {address.isDefault && (
                            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                              Default
                            </span>
                          )}
                        </span>

                        <span className="mt-1 block text-gray-700">
                          {address.fullName} · {address.phone}
                        </span>
                        <span className="block text-gray-500">
                          {address.addressLine}
                        </span>
                        <span className="block text-gray-500">
                          {address.city} {address.postalCode}
                        </span>

                        <span className="mt-3 flex items-center gap-4 text-xs">
                          {!address.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefault(address.id)}
                              className="font-medium text-violet-600 transition hover:text-violet-800"
                            >
                              Set as default
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="flex items-center gap-1 font-medium text-red-500 transition hover:text-red-700"
                          >
                            <Trash2 size={13} aria-hidden="true" />
                            Delete
                          </button>
                        </span>
                      </span>
                    </label>
                  ))}

                  {/* Add new address option */}
                  <label
                    className={`${addressCardClass(
                      selectedAddressId === "new",
                    )} items-center`}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={selectedAddressId === "new"}
                      onChange={startNewAddress}
                      className="h-4 w-4 shrink-0 accent-violet-600"
                    />

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                      <Plus size={20} aria-hidden="true" />
                    </span>

                    <span className="text-sm font-medium text-gray-800">
                      Add a new address
                    </span>
                  </label>
                </div>
              )}

              {/* Form sirf tab dikhao jab naya address ho (ya koi saved na ho) */}
              {showForm && (
                <div className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fullName" className={labelClass}>
                        Full Name <span className="text-pink-500">*</span>
                      </label>

                      <input
                        id="fullName"
                        type="text"
                        required
                        value={shippingFullName}
                        onChange={(e) => setShippingFullName(e.target.value)}
                        className={inputClass}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone Number <span className="text-pink-500">*</span>
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        required
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        className={inputClass}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className={labelClass}>
                      Street Address <span className="text-pink-500">*</span>
                    </label>

                    <textarea
                      id="address"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      rows={3}
                      className={`${inputClass} resize-none`}
                      placeholder="House number, street, area..."
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="city" className={labelClass}>
                        City <span className="text-pink-500">*</span>
                      </label>

                      <select
                        id="city"
                        required
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select your city</option>

                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="postal" className={labelClass}>
                        Postal Code <span className="text-pink-500">*</span>
                      </label>

                      <input
                        id="postal"
                        type="text"
                        required
                        value={shippingPostalCode}
                        onChange={(e) => setShippingPostalCode(e.target.value)}
                        className={inputClass}
                        placeholder="Postal code"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl bg-violet-50/60 p-4">
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="h-4 w-4 accent-violet-600"
                      />
                      <MapPin
                        size={16}
                        className="text-violet-600"
                        aria-hidden="true"
                      />
                      Save this address for next time
                    </label>

                    {saveAddress && (
                      <div>
                        <label htmlFor="addressLabel" className={labelClass}>
                          Address Name
                        </label>

                        <input
                          id="addressLabel"
                          type="text"
                          maxLength={30}
                          value={addressLabel}
                          onChange={(e) => setAddressLabel(e.target.value)}
                          className={inputClass}
                          placeholder="Home, Office..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-serif text-2xl font-semibold text-gray-800">
                Payment Method
              </h2>

              <div className="mt-6 space-y-4">
                <label className={optionClass(paymentMethod === "COD")}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="h-4 w-4 accent-violet-600"
                  />

                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <Banknote size={22} aria-hidden="true" />
                  </span>

                  <span>
                    <span className="block font-medium text-gray-800">
                      Cash on Delivery
                    </span>
                    <span className="block text-xs text-gray-500">
                      Pay when you receive the order
                    </span>
                  </span>
                </label>

                <label className={optionClass(paymentMethod === "Card")}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "Card"}
                    onChange={() => setPaymentMethod("Card")}
                    className="h-4 w-4 accent-violet-600"
                  />

                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <CreditCard size={22} aria-hidden="true" />
                  </span>

                  <span>
                    <span className="block font-medium text-gray-800">
                      Card (Test)
                    </span>
                    <span className="block text-xs text-gray-500">
                      Simulated payment, no real charge
                    </span>
                  </span>
                </label>
              </div>

              {paymentMethod === "Card" && (
                <div className="mt-6 space-y-5 rounded-2xl bg-violet-50/60 p-5">
                  <div>
                    <label htmlFor="cardNumber" className={labelClass}>
                      Card Number
                    </label>

                    <input
                      id="cardNumber"
                      type="text"
                      required
                      inputMode="numeric"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className={inputClass}
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="cardExpiry" className={labelClass}>
                        Expiry
                      </label>

                      <input
                        id="cardExpiry"
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className={inputClass}
                        placeholder="MM/YY"
                      />
                    </div>

                    <div>
                      <label htmlFor="cardCvc" className={labelClass}>
                        CVC
                      </label>

                      <input
                        id="cardCvc"
                        type="password"
                        required
                        inputMode="numeric"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className={inputClass}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    Test cards: 4242 4242 4242 4242 (success), 4000 0000 0000
                    0002 (declined)
                  </p>
                </div>
              )}
            </div>

            {/* Mobile place order button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
            >
              {loading && <LoaderCircle size={20} className="animate-spin" />}
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          {/* Order summary */}
          <div>
            <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm lg:sticky lg:top-32">
              <h2 className="font-serif text-2xl font-semibold text-gray-800">
                Order Summary
              </h2>

              {/* Items */}
              <div className="mt-6 max-h-72 space-y-3 overflow-y-auto">
                {cart.items.map((item) => {
                  const imageUrl = item.imageUrl
                    ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}${item.imageUrl}`
                    : "https://placehold.co/100x100?text=No+Image";

                  return (
                    <div
                      key={item.cartItemId}
                      className="flex items-center gap-3 rounded-xl bg-violet-50/60 p-3"
                    >
                      <img
                        src={imageUrl}
                        alt={item.productName}
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-violet-700">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-3 border-t border-violet-100 pt-6 text-sm">
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

              <div className="mt-6 flex items-center justify-between border-t border-violet-100 pt-6">
                <span className="text-lg font-semibold text-gray-800">
                  Total
                </span>

                <span className="text-3xl font-bold text-violet-700">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Desktop place order button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="mt-6 hidden w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
              >
                {loading && <LoaderCircle size={20} className="animate-spin" />}
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
                <ShieldCheck
                  size={14}
                  className="shrink-0 text-violet-600"
                  aria-hidden="true"
                />
                {paymentMethod === "COD"
                  ? "You will pay in cash when the order is delivered."
                  : "Simulated card payment. No real money is charged."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
