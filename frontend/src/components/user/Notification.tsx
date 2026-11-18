import { Link } from "react-router-dom";

export interface NotificationItem {
  _id: string;
  type: "application_received" | "application_accepted";
  actor?: { name?: string };
  project?: { _id?: string; title?: string };
  application?: { role?: string };
  isRead: boolean;
  createdAt: string;
}

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};

const Notification = ({
  notification,
  onOpen,
}: {
  notification: NotificationItem;
  onOpen: (id: string) => void;
}) => {
  const actor = notification.actor?.name || "Someone";
  const project = notification.project?.title || "a project";
  const role = notification.application?.role;
  const message =
    notification.type === "application_received"
      ? `${actor} applied to ${project}${role ? ` for ${role}` : ""}.`
      : `${actor} accepted your application to ${project}${role ? ` for ${role}` : ""}.`;
  const projectId = notification.project?._id;
  const target =
    notification.type === "application_received"
      ? `/review-applications/${projectId}`
      : `/project-info/${projectId}`;

  return (
    <Link
      to={projectId ? target : "/alert"}
      onClick={() => onOpen(notification._id)}
      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
        notification.isRead
          ? "border-[#E4E1D9] bg-white hover:bg-[#FBFAF7]"
          : "border-[#D5DEFF] bg-[#F1F4FF] hover:bg-[#EAF0FF]"
      }`}
    >
      <span
        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
          notification.isRead ? "bg-transparent" : "bg-[#2F4BE0]"
        }`}
        aria-label={notification.isRead ? "Read" : "Unread"}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm leading-5 text-[#16151A]">
          {message}
        </span>
        <span className="mt-1.5 block text-xs text-[#77747C]">
          {formatTime(notification.createdAt)}
        </span>
      </span>
    </Link>
  );
};

export default Notification;
