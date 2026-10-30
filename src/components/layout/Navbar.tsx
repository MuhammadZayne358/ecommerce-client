import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Phone,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cart } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-violet-100 text-violet-700"
        : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-xl px-4 py-3 text-base font-medium transition ${
      isActive
        ? "bg-violet-100 text-violet-700"
        : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"
    }`;

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-violet-600 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 px-4 py-2 text-xs sm:flex-row sm:px-6 sm:text-sm">
          <p className="flex items-center gap-2">
            <Sparkles size={14} aria-hidden="true" />
            Get 20% off your first order with code{" "}
            <span className="font-semibold">AURA20</span>
          </p>
          <a
            href="tel:+18005550199"
            className="flex items-center gap-2 text-violet-100 transition hover:text-white"
          >
            <Phone size={14} aria-hidden="true" />
            +1 (800) 555-0199
          </a>
        </div>
      </div>

      <div className="border-b border-violet-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="font-serif text-2xl font-semibold text-gray-800"
          >
            Aura<span className="text-violet-600"> Scents</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-2 md:flex" aria-label="Main">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {user ? (
              <>
                {/* Admin (desktop) */}
                {user.role === "Admin" && (
                  <Link
                    to="/admin"
                    className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-600 transition hover:bg-violet-50 hover:text-violet-700 md:flex"
                  >
                    <LayoutDashboard size={18} />
                    Admin
                  </Link>
                )}

                {/* My Orders (desktop) */}
                <Link
                  to="/orders"
                  className="hidden rounded-full px-3 py-2 text-sm text-gray-600 transition hover:bg-violet-50 hover:text-violet-700 md:block"
                >
                  My Orders
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative rounded-full p-2.5 text-gray-600 transition hover:bg-violet-50 hover:text-violet-700"
                  aria-label={`Cart, ${cart?.totalItems ?? 0} items`}
                >
                  <ShoppingCart size={20} />

                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-xs font-medium text-white">
                    {cart?.totalItems ?? 0}
                  </span>
                </Link>

                {/* User name (desktop) */}
                <Link
                  to="/profile"
                  className="hidden items-center gap-2 rounded-full bg-violet-50 py-1.5 pl-2 pr-4 transition hover:bg-violet-100 md:flex"
                  title="My Profile"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white">
                    <User size={14} />
                  </span>

                  <span className="max-w-32 truncate text-sm font-medium text-gray-800">
                    {user.fullName}
                  </span>
                </Link>

                {/* Logout (desktop) */}
                <button
                  onClick={handleLogout}
                  className="hidden rounded-full p-2.5 text-gray-600 transition hover:bg-rose-50 hover:text-rose-600 md:block"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                {/* Login / Register (desktop) */}
                <Link
                  to="/login"
                  className="hidden rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-violet-700 md:block"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="hidden rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200 transition hover:bg-violet-800 md:block"
                >
                  Register
                </Link>
              </>
            )}

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-full p-2.5 text-gray-700 transition hover:bg-violet-50 hover:text-violet-700 md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            className="border-t border-violet-100 bg-white px-4 py-4 md:hidden"
            aria-label="Mobile"
          >
            <div className="space-y-1">
              <NavLink to="/" onClick={closeMenu} className={mobileLinkClass}>
                Home
              </NavLink>

              <NavLink
                to="/products"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                Products
              </NavLink>

              <NavLink
                to="/about"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                About Us
              </NavLink>
              <NavLink
                to="/contact"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                Contact
              </NavLink>

              {user ? (
                <>
                  <NavLink
                    to="/orders"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    My Orders
                  </NavLink>
                  
                  <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    My Profile
                  </NavLink>

                  {user.role === "Admin" && (
                    <NavLink
                      to="/admin"
                      onClick={closeMenu}
                      className={mobileLinkClass}
                    >
                      Admin Dashboard
                    </NavLink>
                  )}
                </>
              ) : null}
            </div>

            <div className="mt-4 border-t border-violet-100 pt-4">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
                      <User size={16} />
                    </span>

                    <span className="truncate text-sm font-medium text-gray-800">
                      {user.fullName}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-full border border-violet-200 px-4 py-3 text-center text-sm font-medium text-violet-700 transition hover:bg-violet-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-full bg-violet-600 px-4 py-3 text-center text-sm font-medium text-white shadow-md shadow-violet-200 transition hover:bg-violet-800"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
