// src/pages/auth/ResetPassword.tsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LoaderCircle, Lock } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "w-full rounded-xl border border-violet-100 bg-violet-50/50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100";

const iconClass =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-violet-400";

function ResetPassword() {

  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
  if (user) logout();
}, [user]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/Auth/reset-password", { email, token, newPassword });

      setDone(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-violet-100 via-violet-50 to-white px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-violet-100 bg-white p-8 shadow-xl shadow-violet-100/60">
        <h1 className="font-serif text-3xl font-semibold text-gray-800">
          Reset Password
        </h1>

        {!email || !token ? (
          <>
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              This reset link is invalid.
            </p>

            <Link
              to="/forgot-password"
              className="mt-6 block text-center text-sm font-semibold text-violet-700 hover:underline"
            >
              Request a new link
            </Link>
          </>
        ) : done ? (
          <>
            <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Your password has been reset. You can now login.
            </p>

            <Link
              to="/login"
              className="mt-6 block rounded-full bg-violet-600 px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
            >
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-gray-500">
              Choose a new password for {email}.
            </p>

            {error && (
              <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="relative">
                <Lock size={18} className={iconClass} aria-hidden="true" />

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="New password"
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Lock size={18} className={iconClass} aria-hidden="true" />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <LoaderCircle size={18} className="animate-spin" />}
                {loading ? "Saving..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;