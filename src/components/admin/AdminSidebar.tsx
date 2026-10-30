import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Contact,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Store,
  Tags,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
  { to: "/admin/categories", label: "Categories", icon: Tags, end: false },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, end: false },
  { to: "/admin/admincontacts", label: "Contacts", icon: Contact, end: false },

];

function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      closeMenu();
      navigate("/login");
    }
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-white text-violet-700 shadow-md shadow-violet-900/20"
        : "text-violet-200 hover:bg-white/10 hover:text-white"
    }`;

  const content = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-white/10 pb-6">
        <Link
          to="/admin"
          onClick={closeMenu}
          className="font-serif text-2xl font-semibold text-white"
        >
          Aura<span className="text-violet-300"> Scents</span>
        </Link>

        <p className="mt-1 text-xs uppercase tracking-widest text-violet-300">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1.5" aria-label="Admin">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={closeMenu}
            className={navClass}
          >
            <Icon size={20} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="space-y-1.5 border-t border-white/10 pt-5">
        {user && (
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-violet-700">
              <User size={16} aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user.fullName}
              </p>

              <p className="truncate text-xs text-violet-300">{user.email}</p>
            </div>
          </div>
        )}

        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-violet-200 transition hover:bg-white/10 hover:text-white"
        >
          <Store size={20} aria-hidden="true" />
          Back to Store
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-violet-200 transition hover:bg-rose-500/20 hover:text-rose-200"
        >
          <LogOut size={20} aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-gradient-to-b from-violet-700 via-violet-800 to-violet-950 p-5 lg:block">
        {content}
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-violet-800 px-4 text-white shadow-md lg:hidden">
        <Link to="/admin" className="font-serif text-xl font-semibold">
          Aura<span className="text-violet-300"> Scents</span>
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="rounded-full p-2 transition hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeMenu}
            aria-hidden="true"
          />

          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85%] bg-gradient-to-b from-violet-700 via-violet-800 to-violet-950 p-5 shadow-2xl">
            <button
              onClick={closeMenu}
              className="absolute right-3 top-3 rounded-full p-2 text-violet-200 transition hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>

            {content}
          </aside>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;