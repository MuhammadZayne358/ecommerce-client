import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Sparkles } from "lucide-react";
import api from "../../api/axios";

interface FooterColumn {
  title: string;
  links: { label: string; to: string }[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/products" },
      { label: "Cart", to: "/cart" },
      { label: "My Orders", to: "/orders" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", to: "/login" },
      { label: "Register", to: "/register" },
    ],
  },
];

function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/newsletter", { email });

      setStatus({ ok: true, text: response.data.message });
      setEmail("");
    } catch (err: any) {
      setStatus({
        ok: false,
        text: err?.response?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <>
      {/* Newsletter */}
      <section className="px-4 pb-20 pt-20 sm:px-6">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-violet-50 px-6 py-14 text-center ring-1 ring-violet-100 sm:px-12">
          <Sparkles className="absolute left-8 top-8 text-violet-300" size={24} aria-hidden="true" />
          <Sparkles className="absolute bottom-8 right-10 text-violet-300" size={18} aria-hidden="true" />

          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-violet-600 shadow-sm">
            <Mail size={22} aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-balance font-serif text-3xl font-semibold text-gray-800 sm:text-4xl">
            Join the Aura Circle
          </h2>
          <p className="mx-auto mt-3 max-w-md text-gray-500">
            Subscribe for new arrivals, exclusive offers and fragrance tips.
          </p>

          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={handleSubscribe}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-violet-200 bg-white px-5 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
            />
            <button
              type="submit"
              className="rounded-full bg-violet-600 px-7 py-3.5 text-sm font-medium text-white shadow-md shadow-violet-200 transition hover:bg-violet-800"
            >
              Subscribe
            </button>
          </form>

          {status && (
            <p
              className={`mt-4 text-sm ${
                status.ok ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {status.text}
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-violet-100 bg-violet-50 px-4 pt-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="font-serif text-2xl font-semibold text-gray-800">
              Aura<span className="text-violet-600"> Scents</span>
            </Link>
            <p className="mt-4 max-w-sm leading-relaxed text-gray-500">
              Fresh, elegant fragrances curated to help you find the scent that
              feels like you.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="font-semibold text-gray-800">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-gray-500 transition hover:text-violet-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-7xl border-t border-violet-100 py-6 text-center text-sm text-gray-500">
          {`© ${new Date().getFullYear()} Aura Scents. All rights reserved.`}
        </div>
      </footer>
    </>
  );
}

export default Footer;