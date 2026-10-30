// src/pages/auth/ForgotPassword.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, Mail } from "lucide-react";
import api from "../../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await api.post("/Auth/forgot-password", { email });

      setSent(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-violet-100 via-violet-50 to-white px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-violet-100 bg-white p-8 shadow-xl shadow-violet-100/60">
        <h1 className="font-serif text-3xl font-semibold text-gray-800">
          Forgot Password
        </h1>

        {sent ? (
          <>
            <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              If an account exists for this email, a reset link has been sent.
              Please check your inbox.
            </p>

            <Link
              to="/login"
              className="mt-6 block text-center text-sm font-semibold text-violet-700 hover:underline"
            >
              Back to Login
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email and we will send you a link to reset your
              password.
            </p>

            {error && (
              <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
                  aria-hidden="true"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-violet-100 bg-violet-50/50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <LoaderCircle size={18} className="animate-spin" />}
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <Link
              to="/login"
              className="mt-6 block text-center text-sm font-semibold text-violet-700 hover:underline"
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;