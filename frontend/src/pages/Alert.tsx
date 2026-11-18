import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../Services/api";
import { userContext } from "../context/UserContext";
import Notification, {
  type NotificationItem,
} from "../components/user/Notification";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/error/PageState";

const Alert = () => {
  const context = useContext(userContext);
  const setNotificationCount = context?.setNotificationCount;
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const unreadCount = context?.notificationCount ?? 0;

  useEffect(() => {
    let active = true;

    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications", {
          withCredentials: true,
        });
        if (active) {
          setNotifications(response.data.notifications);
          setNotificationCount?.(response.data.unreadCount);
        }
      } catch {
        if (active) {
          setLoadError("Notifications couldn’t be loaded. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchNotifications();
    return () => {
      active = false;
    };
  }, [retryCount, setNotificationCount]);

  const markAsRead = async (id: string) => {
    const notification = notifications.find((item) => item._id === id);
    if (!notification || notification.isRead) return;

    try {
      await api.patch(`/notifications/${id}/read`, {}, {
        withCredentials: true,
      });
      setNotifications((current) =>
        current.map((item) =>
          item._id === id ? { ...item, isRead: true } : item,
        ),
      );
      setNotificationCount?.((count) => Math.max(0, count - 1));
    } catch {
      toast.error("Unable to mark notification as read.");
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    setUpdating(true);
    try {
      await api.patch("/notifications/read-all", {}, {
        withCredentials: true,
      });
      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true })),
      );
      setNotificationCount?.(0);
    } catch {
      toast.error("Unable to update notifications.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 pb-24">
      <header className="w-full text-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#16151A]">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-[#77747C]">
            Updates about your applications and projects
          </p>
        </div>
      </header>

      {unreadCount > 0 && (
        <div className="flex items-center justify-center gap-3">
          <span className="rounded-full bg-[#EEF1FF] px-3 py-1 text-xs font-semibold text-[#2F4BE0]">
            {unreadCount} unread
          </span>
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={updating}
            className="rounded-lg border border-[#DAD7CF] bg-white px-3 py-2 text-xs font-semibold text-[#3D3A44] transition hover:bg-[#F7F6F2] disabled:opacity-60"
          >
            {updating ? "Updating..." : "Mark all read"}
          </button>
        </div>
      )}

      {loading ? (
        <LoadingState label="Loading notifications..." />
      ) : loadError ? (
        <ErrorState
          title="Notifications couldn’t be loaded"
          description={loadError}
          onRetry={() => {
            setLoadError(null);
            setLoading(true);
            setRetryCount((count) => count + 1);
          }}
        />
      ) : notifications.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {notifications.map((notification) => (
            <Notification
              key={notification._id}
              notification={notification}
              onOpen={(id) => void markAsRead(id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="You’re all caught up"
          description="New application updates will appear here."
        />
      )}
    </main>
  );
};

export default Alert;
