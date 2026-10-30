import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Inbox,
  LoaderCircle,
  Mail,
  Trash2,
} from "lucide-react";
import  type { ContactMessage } from "../../types/contact";
import { deleteContactMessage, getContactMessages, markContactAsRead } from "../../api/contactApi";

type Filter = "all" | "unread" | "read";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

function AdminContacts() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);

        const data = await getContactMessages();

        setMessages(data);
      } catch (error: any) {
        console.error(error);

        setError(
          error?.response?.data?.message || "Failed to load messages."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages]
  );

  const filtered = useMemo(() => {
    if (filter === "unread") return messages.filter((m) => !m.isRead);
    if (filter === "read") return messages.filter((m) => m.isRead);
    return messages;
  }, [messages, filter]);

  const handleMarkRead = async (id: number) => {
    try {
      setBusyId(id);
      setError("");

      await markContactAsRead(id);

      setMessages((previous) =>
        previous.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      );
    } catch (error: any) {
      console.error(error);

      setError(error?.response?.data?.message || "Failed to update message.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;

    try {
      setBusyId(id);
      setError("");

      await deleteContactMessage(id);

      setMessages((previous) => previous.filter((m) => m.id !== id));
    } catch (error: any) {
      console.error(error);

      setError(error?.response?.data?.message || "Failed to delete message.");
    } finally {
      setBusyId(null);
    }
  };

  const toggleOpen = (message: ContactMessage) => {
    const opening = openId !== message.id;

    setOpenId(opening ? message.id : null);

    // Khulte hi unread message ko read mark kar do
    if (opening && !message.isRead) {
      handleMarkRead(message.id);
    }
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={35} className="animate-spin text-violet-600" />

          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-gray-900 sm:text-4xl">
          Contact Messages
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {messages.length} total, {unreadCount} unread.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              filter === item.value
                ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                : "border border-violet-200 text-violet-700 hover:bg-violet-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-violet-100 bg-white px-6 py-16 text-center shadow-sm">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <Inbox size={30} aria-hidden="true" />
          </span>

          <p className="mt-5 font-medium text-gray-800">No messages found</p>

          <p className="mt-1 text-sm text-gray-500">
            Messages from the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((message) => {
            const isOpen = openId === message.id;
            const busy = busyId === message.id;

            return (
              <div
                key={message.id}
                className="rounded-2xl border border-violet-100 bg-white shadow-sm"
              >
                {/* Row */}
                <button
                  type="button"
                  onClick={() => toggleOpen(message)}
                  className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      message.isRead ? "bg-transparent" : "bg-violet-600"
                    }`}
                    aria-label={message.isRead ? "Read" : "Unread"}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span
                        className={`text-sm text-gray-900 ${
                          message.isRead ? "font-medium" : "font-semibold"
                        }`}
                      >
                        {message.name}
                      </span>

                      <span className="truncate text-sm text-gray-500">
                        {message.email}
                      </span>
                    </span>

                    <span className="mt-1 block truncate text-sm text-gray-600">
                      {message.subject || "(No subject)"}
                    </span>
                  </span>

                  <span className="hidden shrink-0 text-xs text-gray-400 sm:block">
                    {formatDate(message.createdAt)}
                  </span>

                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={`shrink-0 text-violet-600 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Details */}
                {isOpen && (
                  <div className="border-t border-violet-100 px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
                    <p className="mb-3 text-xs text-gray-400 sm:hidden">
                      {formatDate(message.createdAt)}
                    </p>

                    <p className="whitespace-pre-wrap rounded-xl bg-violet-50/40 p-4 text-sm leading-relaxed text-gray-700">
                      {message.message}
                    </p>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                      

                      <a
                        href={`mailto:${message.email}?subject=${encodeURIComponent(
                          `Re: ${message.subject || "Your message"}`
                        )}`}
                        className="flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
                      >
                        <Mail size={16} aria-hidden="true" />
                        Reply
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDelete(message.id)}
                        disabled={busy}
                        className="flex items-center justify-center gap-2 rounded-full border border-rose-200 px-6 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {busy ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} aria-hidden="true" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminContacts;