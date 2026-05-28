import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCheckDouble,
  faTrash,
  faInbox,
} from "@fortawesome/free-solid-svg-icons";

import {
  getNotifications,
  readAllNotifications,
  readNotificationById,
  deleteNotification,
} from "../api/notifications";

const notificationTypeStyles = {
  SYSTEM: "bg-stone-100 text-stone-700",
  EVENT: "bg-blue-100 text-blue-700",
  POST: "bg-purple-100 text-purple-700",
  COMMENT: "bg-emerald-100 text-emerald-700",
  LIKE: "bg-rose-100 text-rose-700",
  POLL: "bg-amber-100 text-amber-700",
  ANNOUNCEMENT: "bg-orange-100 text-orange-700",
  OTHER: "bg-stone-100 text-stone-700",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [meta, setMeta] = useState(null);

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.isRead).length;
  }, [notifications]);

  async function fetchNotifications(page = 1) {
    try {
      setLoading(true);

      const response = await getNotifications({
        page,
        limit: 20,
      });

      setNotifications(response.data.items);
      setMeta(response.data.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadNotifications = async () => {
      await fetchNotifications();
    };

    loadNotifications();
  }, []);

  async function handleRead(notificationId) {
    try {
      setProcessingId(notificationId);

      await readNotificationById(notificationId);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId
            ? {
                ...item,
                isRead: true,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReadAll() {
    try {
      setProcessingId("all");

      await readAllNotifications();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        })),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(notificationId) {
    try {
      setProcessingId(notificationId);

      await deleteNotification(notificationId);

      setNotifications((prev) =>
        prev.filter((item) => item.id !== notificationId),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-brand mb-2 text-sm font-semibold tracking-[0.3em] uppercase">
            Activity
          </p>

          <h1 className="font-heading text-text text-4xl font-semibold">
            Notifications
          </h1>

          <p className="text-text-soft font-body mt-2 text-sm">
            Stay updated with events, posts, collaborations, and announcements.
          </p>
        </div>

        <button
          onClick={handleReadAll}
          disabled={unreadCount === 0 || processingId === "all"}
          className={clsx(
            "rounded-base inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition",

            unreadCount === 0
              ? "bg-border text-text-soft cursor-not-allowed"
              : "bg-brand text-white hover:opacity-90",
          )}
        >
          <FontAwesomeIcon icon={faCheckDouble} />

          {processingId === "all" ? "Processing..." : "Read All"}
        </button>
      </div>

      {/* Empty State */}
      {!loading && notifications.length === 0 && (
        <div className="bg-surface border-border rounded-card flex flex-col items-center justify-center border px-6 py-16 text-center">
          <div className="bg-brand/10 text-brand mb-5 flex h-16 w-16 items-center justify-center rounded-full text-2xl">
            <FontAwesomeIcon icon={faInbox} />
          </div>

          <h2 className="font-heading text-text text-2xl font-semibold">
            No Notifications
          </h2>

          <p className="text-text-soft font-body mt-3 max-w-md text-sm leading-7">
            You currently have no notifications. New activity and announcements
            will appear here.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-surface border-border rounded-card animate-pulse border p-5"
            >
              <div className="bg-border mb-4 h-4 w-40 rounded-full" />
              <div className="bg-border mb-2 h-3 w-full rounded-full" />
              <div className="bg-border h-3 w-2/3 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Notifications */}
      {!loading && notifications.length > 0 && (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={clsx(
                "bg-surface border-border rounded-card relative overflow-hidden border p-5 transition-all",

                !notification.isRead && "border-brand/40 bg-brand/5 shadow-sm",
              )}
            >
              {!notification.isRead && (
                <div className="bg-brand absolute top-5 right-5 h-2.5 w-2.5 rounded-full" />
              )}

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span
                      className={clsx(
                        "rounded-full px-3 py-1 text-xs font-semibold uppercase",
                        notificationTypeStyles[notification.type],
                      )}
                    >
                      {notification.type}
                    </span>

                    <span className="text-text-soft text-xs">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h2 className="text-text font-heading text-xl font-semibold">
                    {notification.title}
                  </h2>

                  <p className="text-text-soft font-body mt-2 text-sm leading-7">
                    {notification.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleRead(notification.id)}
                      disabled={processingId === notification.id}
                      className="bg-brand rounded-base flex h-10 w-10 items-center justify-center text-sm text-white transition hover:opacity-90"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(notification.id)}
                    disabled={processingId === notification.id}
                    className="bg-background border-border text-text-soft rounded-base hover:bg-surface flex h-10 w-10 items-center justify-center border text-sm transition"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Footer Meta */}
      {meta && notifications.length > 0 && (
        <div className="text-text-soft mt-6 flex items-center justify-between text-sm">
          <p>
            Total Notifications:{" "}
            <span className="text-text font-medium">{meta.total}</span>
          </p>

          <p>
            Page <span className="text-text font-medium">{meta.page}</span> of{" "}
            <span className="text-text font-medium">{meta.totalPages}</span>
          </p>
        </div>
      )}
    </section>
  );
}
