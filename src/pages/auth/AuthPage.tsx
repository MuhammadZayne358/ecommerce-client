import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { register } from "../../api/authApi";

type Mode = "login" | "register";

interface AuthPageProps {
  initialMode: Mode;
}

const inputClass =
  "w-full rounded-xl border border-violet-100 bg-violet-50/50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100";

const iconClass =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-violet-400";

function AuthPage({ initialMode }: AuthPageProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState<Mode>(initialMode);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register form
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const switchMode = (next: Mode) => {
    if (next === mode) return;

    setLoginError("");
    setRegisterError("");
    setMode(next);

    window.history.replaceState(
      null,
      "",
      next === "login" ? "/login" : "/register",
    );
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setLoginError("");
    setLoginLoading(true);

    try {
      await login(loginEmail, loginPassword);

      navigate("/");
    } catch (error: any) {
      setLoginError(error.response?.data?.message ?? "Login failed.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    setRegisterError("");
    setRegisterLoading(true);

    try {
      await register({
        fullName,
        email: registerEmail,
        password: registerPassword,
      });
    } catch (error: any) {
      setRegisterError(error.response?.data?.message ?? "Registration failed.");
      setRegisterLoading(false);
      return;
    }

    // Account ban gaya, ab khud login karwa dein
    try {
      await login(registerEmail, registerPassword);

      navigate("/");
    } catch {
      setLoginEmail(registerEmail);
      setLoginError("Account created. Please login to continue.");
      setRegisterLoading(false);
      switchMode("login");
    }
  };

  const loginWrapper =
    mode === "login"
      ? "block md:translate-x-0 md:opacity-100 md:z-20"
      : "hidden md:block md:translate-x-full md:opacity-0 md:pointer-events-none md:z-10";

  const registerWrapper =
    mode === "register"
      ? "block md:translate-x-full md:opacity-100 md:z-20"
      : "hidden md:block md:translate-x-0 md:opacity-0 md:pointer-events-none md:z-10";

  const wrapperBase =
    "w-full md:absolute md:left-0 md:top-0 md:h-full md:w-1/2 md:transition-all md:duration-700 md:ease-in-out";

  const tabClass = (active: boolean) =>
    `flex-1 rounded-full py-2.5 text-sm font-medium transition ${
      active
        ? "bg-violet-600 text-white shadow-md shadow-violet-200"
        : "text-violet-700 hover:bg-violet-100"
    }`;

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br ... px-4 py-10">
      {" "}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-100/60 md:h-[640px]">
        {/* Mobile tabs */}
        <div className="flex gap-2 border-b border-violet-100 p-3 md:hidden">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={tabClass(mode === "login")}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => switchMode("register")}
            className={tabClass(mode === "register")}
          >
            Register
          </button>
        </div>

        {/* Login form */}
        <div className={`${wrapperBase} ${loginWrapper}`}>
          <div className="flex h-full flex-col justify-center px-6 py-8 sm:px-10 md:px-12">
            <h1 className="font-serif text-3xl font-semibold text-gray-800">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to your account to continue shopping.
            </p>

            {loginError && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-sm font-medium text-gray-800"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail size={18} className={iconClass} aria-hidden="true" />

                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-sm font-medium text-gray-800"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock size={18} className={iconClass} aria-hidden="true" />

                  <input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className={`${inputClass} pr-12`}
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 transition hover:text-violet-600"
                    aria-label={
                      showLoginPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showLoginPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-violet-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginLoading && (
                  <LoaderCircle size={18} className="animate-spin" />
                )}
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 md:hidden">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="font-semibold text-violet-700 hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Register form */}
        <div className={`${wrapperBase} ${registerWrapper}`}>
          <div className="flex h-full flex-col justify-center px-6 py-8 sm:px-10 md:px-12">
            <h1 className="font-serif text-3xl font-semibold text-gray-800">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join Aura Scents and find your signature scent.
            </p>

            {registerError && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {registerError}
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-1.5 block text-sm font-medium text-gray-800"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User size={18} className={iconClass} aria-hidden="true" />

                  <input
                    id="register-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="register-email"
                  className="mb-1.5 block text-sm font-medium text-gray-800"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail size={18} className={iconClass} aria-hidden="true" />

                  <input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="mb-1.5 block text-sm font-medium text-gray-800"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock size={18} className={iconClass} aria-hidden="true" />

                  <input
                    id="register-password"
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={6}
                    className={`${inputClass} pr-12`}
                    placeholder="At least 6 characters"
                  />

                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 transition hover:text-violet-600"
                    aria-label={
                      showRegisterPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showRegisterPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {registerLoading && (
                  <LoaderCircle size={18} className="animate-spin" />
                )}
                {registerLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 md:hidden">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-semibold text-violet-700 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        {/* Sliding overlay panel (sirf desktop par) */}
        <div
          className={`absolute left-1/2 top-0 z-30 hidden h-full w-1/2 overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-violet-900 transition-transform duration-700 ease-in-out md:block ${
            mode === "register" ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <img
            src="/images/hero-perfume.png"
            alt=""
            aria-hidden="true"
            className="absolute -bottom-6 left-1/2 w-72 -translate-x-1/2 opacity-30"
          />

          {/* Login mode: Register ki dawat */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center px-10 text-center text-white transition-opacity duration-500 ${
              mode === "login"
                ? "opacity-100 delay-300"
                : "pointer-events-none opacity-0"
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-medium text-violet-200">
              <Sparkles size={16} aria-hidden="true" />
              Aura Scents
            </span>

            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight">
              New here?
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-violet-100">
              Create an account and discover fragrances made for every mood and
              memory.
            </p>

            <button
              type="button"
              onClick={() => switchMode("register")}
              className="mt-8 rounded-full border-2 border-white px-8 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-violet-700"
            >
              Create Account
            </button>
          </div>

          {/* Register mode: Login ki dawat */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center px-10 text-center text-white transition-opacity duration-500 ${
              mode === "register"
                ? "opacity-100 delay-300"
                : "pointer-events-none opacity-0"
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-medium text-violet-200">
              <Sparkles size={16} aria-hidden="true" />
              Aura Scents
            </span>

            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight">
              Welcome back!
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-violet-100">
              Already have an account? Login and continue where you left off.
            </p>

            <button
              type="button"
              onClick={() => switchMode("login")}
              className="mt-8 rounded-full border-2 border-white px-8 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-violet-700"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
