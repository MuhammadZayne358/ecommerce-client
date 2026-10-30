import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Sparkles,
  ShieldCheck,
  Gem,
  Leaf,
  Star,
  Flower2,
} from "lucide-react";

const values = [
  {
    icon: Gem,
    number: "01",
    title: "Quality First",
    description:
      "We believe a great fragrance should create a memorable experience with every wear.",
  },
  {
    icon: Heart,
    number: "02",
    title: "Made for You",
    description:
      "Every personality is different. Your fragrance should be a reflection of who you are.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Shop with Confidence",
    description:
      "We aim to make discovering and shopping for your favourite scents simple and convenient.",
  },
  {
    icon: Leaf,
    number: "04",
    title: "A Story in Every Scent",
    description:
      "Some fragrances remind us of a person, a place or a moment we never want to forget.",
  },
];

function About() {
  return (
    <main className="overflow-hidden bg-white font-sans text-gray-800">

      {/* Hero */}
      <section className="relative bg-[#faf8ff] px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-violet-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-fuchsia-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
              <Sparkles size={15} />
              The Aura Philosophy
            </div>

            <h1 className="font-serif text-5xl font-medium leading-[1.1] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              We believe in
              <span className="block italic text-violet-600">
                the feeling.
              </span>
              <span className="block">Not just the scent.</span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-gray-500 sm:text-lg">
              Some things are hard to explain, but impossible to forget.
              A familiar feeling, a special moment, a scent that feels
              like you. That's the world we want to share at Aura Scents.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-3 rounded-full bg-violet-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-900"
              >
                Explore Our Collection
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-3 text-sm text-gray-500">
              <span className="h-px w-10 bg-violet-400" />
              A fragrance journey, made personal.
            </div>
          </div>

          {/* Abstract artwork — no product images */}
          <div className="relative mx-auto flex aspect-square w-full max-w-lg items-center justify-center">
            <div className="absolute inset-[7%] rounded-full border border-violet-200" />
            <div className="absolute inset-[15%] rounded-full border border-violet-300/70" />
            <div className="absolute inset-[23%] rounded-full bg-gradient-to-br from-violet-200 via-fuchsia-100 to-white shadow-2xl shadow-violet-200/60" />

            <div className="absolute right-[12%] top-[15%] h-20 w-20 rounded-full bg-fuchsia-200/70 blur-xl sm:h-28 sm:w-28" />
            <div className="absolute bottom-[13%] left-[13%] h-24 w-24 rounded-full bg-violet-300/70 blur-2xl sm:h-32 sm:w-32" />

            <div className="absolute left-[17%] top-[20%] h-3 w-3 rounded-full bg-violet-500" />
            <div className="absolute right-[18%] bottom-[25%] h-4 w-4 rounded-full bg-fuchsia-400" />
            <div className="absolute right-[27%] top-[30%] h-2 w-2 rounded-full bg-violet-400" />

            <div className="relative z-10 flex h-48 w-48 flex-col items-center justify-center rounded-full border border-white/80 bg-white/50 text-center shadow-xl shadow-violet-200/40 backdrop-blur-md sm:h-60 sm:w-60">
              <Flower2 size={37} strokeWidth={1.2} className="text-violet-600" />
              <p className="mt-4 font-serif text-4xl italic text-violet-800 sm:text-5xl">
                aura
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-500">
                Find your feeling
              </p>
            </div>

            <div className="absolute bottom-[12%] right-[3%] rounded-2xl border border-violet-100 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
              <p className="font-serif text-lg italic text-violet-700">
                Be unforgettable.
              </p>
            </div>

            <div className="absolute left-[1%] top-[44%] rounded-2xl border border-violet-100 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
              <Sparkles size={18} className="text-violet-600" />
              <p className="mt-1 text-xs text-gray-500">Your own identity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-600">
              <span className="h-px w-8 bg-violet-500" />
              Behind the Aura
            </p>

            <h2 className="mt-6 font-serif text-4xl leading-tight text-gray-900 sm:text-5xl">
              More than a
              <span className="block italic text-violet-600">
                first impression.
              </span>
            </h2>
          </div>

          <div className="lg:pt-2">
            <p className="text-lg leading-9 text-gray-600">
              At Aura Scents, we see fragrance as a personal part of
              everyday life. It can express your mood, complement your
              style and become part of the memories you create.
            </p>

            <p className="mt-5 leading-8 text-gray-500">
              Our goal is to make discovering fragrances an enjoyable
              experience. Whether you're exploring something new or
              searching for a scent that feels familiar, we want you to
              find something that fits your own story.
            </p>

            <div className="mt-9 grid grid-cols-2 gap-6 border-t border-violet-100 pt-7">
              <div>
                <span className="font-serif text-3xl text-violet-700">01</span>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  Discover your style
                </p>
              </div>
              <div>
                <span className="font-serif text-3xl text-violet-700">02</span>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  Make it memorable
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Banner */}
      <section className="px-5 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-violet-800 px-6 py-16 text-white sm:px-12 sm:py-24">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-8 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-36 left-1/4 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <Heart size={29} className="mx-auto text-violet-200" />

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">
              What We Stand For
            </p>

            <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-5xl">
              Your fragrance should feel like
              <span className="block italic text-violet-200">
                an extension of you.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-violet-100 sm:text-base">
              No two people are the same. We celebrate individuality
              and believe the right scent is the one that makes you
              feel comfortable, confident and completely yourself.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-600">
              <span className="h-px w-8 bg-violet-500" />
              What Matters to Us
            </p>

            <h2 className="mt-5 font-serif text-4xl text-gray-900 sm:text-5xl">
              The little things
              <span className="italic text-violet-600"> that matter.</span>
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-gray-500">
              The experience is about more than choosing a fragrance.
              It's about feeling good about the choice you make.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, number, title, description }) => (
              <article
                key={number}
                className="group rounded-3xl border border-violet-100 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100/70"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 transition group-hover:bg-violet-700 group-hover:text-white">
                    <Icon size={23} strokeWidth={1.7} />
                  </span>

                  <span className="font-serif text-sm text-violet-300">
                    {number}
                  </span>
                </div>

                <h3 className="mt-7 font-serif text-xl font-semibold text-gray-900">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-violet-100 bg-[#faf8ff] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Star size={25} className="mx-auto text-violet-600" />

          <h2 className="mt-5 font-serif text-4xl leading-tight text-gray-900 sm:text-5xl">
            Your story is still unfolding.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-8 text-gray-500">
            Discover a fragrance that feels right for your next chapter.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-violet-700 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-900"
          >
            Find Your Fragrance
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default About;
