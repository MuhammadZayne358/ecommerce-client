import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { sendContactMessage } from "../../api/contactapi";

const inputClass =
  "w-full rounded-xl border border-violet-100 bg-violet-50/40 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100";

const labelClass = "mb-2 block text-sm font-medium text-gray-800";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    lines: ["support@yourstore.com"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+92 300 1234567"],
  },
  {
    icon: MapPin,
    title: "Address",
    lines: ["Main Boulevard, Karachi, Pakistan"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Mon - Sat: 9:00 AM - 6:00 PM"],
  },
];

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!formData.name.trim()) {
      setError("Your name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!EMAIL_REGEX.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.message.trim()) {
      setError("Message is required.");
      return;
    }

    try {
      setSubmitting(true);

      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message || "Failed to send your message.";

      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold text-gray-900 sm:text-4xl">
          Contact Us
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-gray-500">
          Have a question or need help with an order? Send us a message and we
          will get back to you as soon as possible.
        </p>
      </div>

      {success && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" aria-hidden="true" />

          <p>Thank you! Your message has been sent. We will reply soon.</p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Info */}
        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
          <h2 className="font-serif text-xl font-semibold text-gray-900">
            Get in Touch
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Reach us through any of the channels below.
          </p>

          <div className="mt-6 space-y-6">
            {contactInfo.map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Icon size={22} aria-hidden="true" />
                </span>

                <div>
                  <p className="text-sm font-medium text-gray-900">{title}</p>

                  {lines.map((line) => (
                    <p key={line} className="mt-0.5 text-sm text-gray-500">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3"
        >
          <h2 className="font-serif text-xl font-semibold text-gray-900">
            Send a Message
          </h2>

          <div className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Your Name <span className="text-pink-500">*</span>
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email <span className="text-pink-500">*</span>
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className={labelClass}>
                Subject
              </label>

              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>
                Message <span className="text-pink-500">*</span>
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={7}
                placeholder="Write your message here"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} aria-hidden="true" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;