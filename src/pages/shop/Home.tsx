import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Headphones,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { getCategories } from "../../api/categoryApi";
import { getProducts } from "../../api/productApi";
import ProductCard from "../../components/product/ProductCard";
import type { Category } from "../../types/category";
import type { Product } from "../../types/product";

/* ---------- Placeholder data (new sections only) ---------- */

interface Avatar {
  initials: string;
  bg: string;
}

interface PromoBanner {
  tag: string;
  title: string;
  description: string;
  image: string;
  to: string;
  bg: string;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}



const heroAvatars: Avatar[] = [
  { initials: "SA", bg: "bg-violet-600" },
  { initials: "LM", bg: "bg-pink-400" },
  { initials: "JK", bg: "bg-violet-400" },
  { initials: "RN", bg: "bg-gray-800" },
];

const promoBanners: PromoBanner[] = [
  {
    tag: "Up to 30% Off",
    title: "Floral Collection",
    description: "Soft blooms of peony, rose and jasmine for every day.",
    image: "/images/promo-floral.png",
    to: "/products",
    bg: "bg-violet-100",
  },
  {
    tag: "Gift Sets",
    title: "Perfect Gifts for Her",
    description: "Beautifully boxed sets, ready to make someone smile.",
    image: "/images/promo-gift.png",
    to: "/products",
    bg: "bg-pink-50",
  },
];

const HOLIDAY_SALE_END = new Date("2026-12-31T23:59:59");

const testimonials: Testimonial[] = [
  {
    name: "Sophia Allen",
    role: "Verified Buyer",
    quote: "I finally found my signature scent. It lasts all day and I get compliments everywhere I go.",
    rating: 5,
  },
  {
    name: "Layla Morgan",
    role: "Verified Buyer",
    quote: "The packaging is gorgeous and delivery was so quick. It made the perfect birthday gift.",
    rating: 5,
  },
  {
    name: "Jessica Kim",
    role: "Verified Buyer",
    quote: "Light, fresh and elegant. Customer support helped me choose the right fragrance family.",
    rating: 4,
  },
];

const faqItems: FaqItem[] = [
  {
    question: "Are your perfumes 100% authentic?",
    answer: "Yes. Every fragrance we sell is sourced directly from brands or authorised distributors.",
  },
  {
    question: "How long does delivery take?",
    answer: "Most orders arrive within 2–5 business days. You can track your order from the My Orders page.",
  },
  {
    question: "Can I return a perfume?",
    answer: "Unopened items can be returned within 14 days of delivery for a full refund.",
  },
  {
    question: "How do I choose the right scent?",
    answer: "Browse by category to explore floral, fresh, woody and oriental notes, or contact our team for a recommendation.",
  },
];

const features: Feature[] = [
  { icon: Truck, title: "Free Shipping", description: "On all orders over $50" },
  { icon: ShieldCheck, title: "Secure Payment", description: "100% protected checkout" },
  { icon: Headphones, title: "24/7 Support", description: "We are here to help anytime" },
];



function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          aria-hidden="true"
          className={i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-violet-600">
          <Sparkles size={14} aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="text-balance font-serif text-3xl font-semibold text-gray-800 sm:text-4xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function getTimeLeft() {
  const diff = Math.max(0, HOLIDAY_SALE_END.getTime() - Date.now());
  return {
    Days: Math.floor(diff / 86_400_000),
    Hours: Math.floor((diff / 3_600_000) % 24),
    Minutes: Math.floor((diff / 60_000) % 60),
    Seconds: Math.floor((diff / 1000) % 60),
  };
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex gap-3" role="timer" aria-live="off">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div
          key={label}
          className="flex w-16 flex-col items-center rounded-2xl bg-white/10 py-3 ring-1 ring-white/20 backdrop-blur sm:w-20"
        >
          <span className="font-serif text-2xl font-semibold tabular-nums sm:text-3xl">
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-xs text-violet-200">{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Page ---------- */

function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts(1, 8),
        ]);

        setCategories(categoriesData.filter((c) => c.isActive));
        setLatestProducts(productsData.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const newArrivals =
    activeCategory === "All"
      ? latestProducts
      : latestProducts.filter((p) => p.categoryName === activeCategory);

  return (
    <div className="bg-white font-sans text-gray-800">

      {/* Hero */}
      <section className="overflow-hidden bg-violet-50 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

          <div className="text-center lg:text-left">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-violet-700 shadow-sm">
              <Sparkles size={14} aria-hidden="true" />
              New Season Collection
            </p>

            <h1 className="text-balance font-serif text-5xl font-semibold leading-tight text-gray-800 sm:text-6xl">
              Find Your <span className="italic text-violet-600">Signature</span> Scent
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-gray-500 lg:mx-0">
              Explore our latest collection of quality fragrances, crafted to
              capture every mood, moment and memory.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-7 py-3.5 font-medium text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800"
              >
                Shop Now
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-white px-7 py-3.5 font-medium text-violet-700 transition hover:border-violet-600 hover:bg-violet-100"
              >
                View All Products
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4 lg:justify-start">
              <div className="flex -space-x-3">
                {heroAvatars.map((avatar) => (
                  <span
                    key={avatar.initials}
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-medium text-white ring-4 ring-violet-50 ${avatar.bg}`}
                    aria-hidden="true"
                  >
                    {avatar.initials}
                  </span>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                  <span className="font-semibold text-gray-800">4.9+ Ratings</span>
                </div>
                <p className="text-sm text-gray-500">From 2,000+ happy customers</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            <div className="absolute inset-6 rounded-full bg-violet-200 blur-3xl" aria-hidden="true" />
            <div className="absolute inset-10 rounded-full bg-violet-100" aria-hidden="true" />

            <img
              src="/images/hero-perfume.png"
              alt="Elegant glass perfume bottle with a gold cap"
              className="relative aspect-square w-full rounded-full object-cover"
            />

            <Sparkles className="absolute right-6 top-4 text-violet-400" size={28} aria-hidden="true" />
            <Sparkles className="absolute bottom-16 left-0 text-violet-300" size={20} aria-hidden="true" />

            <div className="absolute left-0 top-12 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-violet-100 sm:-left-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <ShieldCheck size={20} aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-gray-800">Secure Payment</span>
            </div>

            <div className="absolute bottom-6 right-0 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-violet-100 sm:-right-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <Truck size={20} aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-gray-800">Fast Delivery</span>
            </div>
          </div>

        </div>
      </section>

      {/* Categories */}
      {!loading && categories.length > 0 && (
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">

            <SectionHeading eyebrow="Explore" title="Shop by Category" />

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?categoryId=${category.id}`}
                  className="group relative overflow-hidden rounded-2xl bg-violet-50 p-6 text-center transition duration-300 hover:-translate-y-1 hover:bg-violet-100 hover:shadow-lg hover:shadow-violet-100"
                >
                  <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-violet-600 shadow-sm transition group-hover:bg-violet-600 group-hover:text-white">
                    <Sparkles size={22} aria-hidden="true" />
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-gray-800">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {category.productCount} products
                  </p>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* Promo banners */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          {promoBanners.map((banner) => (
            <div
              key={banner.title}
              className={`group relative flex min-h-64 items-center overflow-hidden rounded-2xl ${banner.bg}`}
            >
              <img
                src={banner.image}
                alt=""
                className="absolute inset-y-0 right-0 h-full w-3/5 object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-y-0 left-0 w-3/5 bg-gradient-to-r from-white/80 to-transparent" aria-hidden="true" />
              <div className="relative max-w-xs p-8">
                <span className="inline-block rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white">
                  {banner.tag}
                </span>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-gray-800">
                  {banner.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{banner.description}</p>
                <Link
                  to={banner.to}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-700 transition hover:gap-3 hover:text-violet-800"
                >
                  Shop Collection
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Sellers (Latest Products) */}
      <section className="bg-violet-50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="Customer Favourites"
            title="Top Seller"
            action={
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-5 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-600 hover:text-white"
              >
                View All
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            }
          />

          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : latestProducts.length === 0 ? (
            <p className="text-gray-500">No products available yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Holiday sale */}
      <section className="px-4 py-20 sm:px-6">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-2xl bg-violet-800 p-8 text-white sm:p-12 lg:grid-cols-2">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-600 opacity-50 blur-3xl" aria-hidden="true" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
              <Clock size={14} aria-hidden="true" />
              Limited Time Offer
            </span>
            <h2 className="mt-5 text-balance font-serif text-4xl font-semibold sm:text-5xl">
              Holiday Sale <span className="italic text-violet-200">Up to 40% Off</span>
            </h2>
            <p className="mt-4 max-w-md text-violet-100">
              Treat yourself or someone special. Our biggest fragrance sale of the
              year ends soon.
            </p>
            <div className="mt-8">
              <Countdown />
            </div>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-medium text-violet-800 transition hover:bg-violet-100"
            >
              Shop the Sale
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <img
              src="/images/holiday-perfume.png"
              alt="Perfume bottle with festive sparkles"
              className="aspect-square w-full rounded-2xl object-cover shadow-2xl"
            />
            <span className="absolute -right-2 -top-2 rounded-full bg-white px-4 py-2 font-serif text-lg font-semibold text-violet-700 shadow-lg">
              -40%
            </span>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-7xl">

          <SectionHeading eyebrow="Just Landed" title="New Arrivals" />

          {categories.length > 0 && (
            <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2" role="tablist" aria-label="Filter by category">
              {["All", ...categories.map((c) => c.name)].map((name) => (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === name}
                  onClick={() => setActiveCategory(name)}
                  className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition ${
                    activeCategory === name
                      ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                      : "bg-violet-50 text-gray-600 hover:bg-violet-100 hover:text-violet-700"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : newArrivals.length === 0 ? (
            <p className="rounded-2xl bg-violet-50 p-8 text-center text-gray-500">
              No products in this category yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-violet-50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Testimonials" title="Loved by Our Customers" />

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100"
              >
                <Quote size={28} className="text-violet-200" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 leading-relaxed text-gray-600">
                  {`"${t.quote}"`}
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between border-t border-violet-100 pt-5">
                  <div>
                    <p className="font-semibold text-gray-800">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                  <StarRating rating={t.rating} />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-violet-600">
              <Sparkles size={14} aria-hidden="true" />
              FAQ
            </p>
            <h2 className="font-serif text-3xl font-semibold text-gray-800 sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-violet-100 bg-white px-6 py-5 transition open:bg-violet-50 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-gray-800">
                  {item.question}
                  <ChevronDown
                    size={20}
                    className="shrink-0 text-violet-600 transition duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 leading-relaxed text-gray-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-2xl bg-violet-100 p-6 sm:p-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
