// src/pages/shop/Profile.tsx
import { useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "w-full rounded-xl border border-violet-100 bg-violet-50/40 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "mb-2 block text-sm font-medium text-gray-800";

const cardClass =
  "rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8";

const buttonClass =
  "flex items-center justify-center gap-2 rounded-full bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60";

interface Message {
  type: "success" | "error";
  text: string;
}

function Notice({ message }: { message: Message | null }) {
  if (!message) return null;

  return (
    <p
      className={`mt-4 rounded-xl px-4 py-3 text-sm ${
        message.type === "success"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-600"
      }`}
    >
      {message.text}
    </p>
  );
}

function Profile() {
  const { user, setUser } = useAuth();

  // Profile
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<Message | null>(null);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!fullName.trim()) {
      setProfileMessage({ type: "error", text: "Full name is required." });
      return;
    }

    try {
      setSavingProfile(true);

      const response = await api.put("/Auth/profile", { fullName });

      if (user) {
        setUser({ ...user, fullName: response.data.fullName });
      }

      setProfileMessage({ type: "success", text: "Profile updated." });
    } catch (err: any) {
      setProfileMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must contain at least 6 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      setSavingPassword(true);

      await api.put("/Auth/change-password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({ type: "success", text: "Password changed." });
    } catch (err: any) {
      setPasswordMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold text-gray-900 sm:text-4xl">
        My Profile
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Manage your account details and password.
      </p>

      {/* Profile details */}
      <form onSubmit={handleProfile} className={`${cardClass} mt-8`}>
        <h2 className="font-serif text-xl font-semibold text-gray-900">
          Account Details
        </h2>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="fullName" className={labelClass}>
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>

            <input
              id="email"
              type="email"
              value={user?.email ?? ""}
              disabled
              className={inputClass}
            />
          </div>
        </div>

        <Notice message={profileMessage} />

        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={savingProfile} className={buttonClass}>
            {savingProfile ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Change password */}
      <form onSubmit={handlePassword} className={`${cardClass} mt-6`}>
        <h2 className="font-serif text-xl font-semibold text-gray-900">
          Change Password
        </h2>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="currentPassword" className={labelClass}>
              Current Password
            </label>

            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="newPassword" className={labelClass}>
                New Password
              </label>

              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <Notice message={passwordMessage} />

        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={savingPassword} className={buttonClass}>
            {savingPassword ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {savingPassword ? "Saving..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;