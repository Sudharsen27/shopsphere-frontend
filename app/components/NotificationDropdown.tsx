"use client";

type NotificationItem = {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  orderId?: string | null;
};

type NotificationDropdownProps = {
  isOpen: boolean;
  notifications: NotificationItem[];
  onNotificationClick: (notification: NotificationItem) => void;
};

export default function NotificationDropdown({
  isOpen,
  notifications,
  onNotificationClick,
}: NotificationDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] shadow-lg z-50">
      <div className="p-3 border-b border-[var(--card-border)]">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Notifications
        </h3>
      </div>

      {notifications.length === 0 ? (
        <div className="p-4 text-sm text-[var(--muted)]">No notifications</div>
      ) : (
        <ul className="divide-y divide-[var(--card-border)]">
          {notifications.map((item) => (
            <li
              key={item._id}
              className={`p-3 ${
                item.isRead
                  ? "bg-transparent"
                  : "bg-blue-50 dark:bg-blue-900/20"
              }`}
            >
              <button
                type="button"
                onClick={() => onNotificationClick(item)}
                className="w-full text-left"
              >
              <p
                className={`text-sm ${
                  item.isRead
                    ? "font-medium text-[var(--foreground)]"
                    : "font-semibold text-[var(--foreground)]"
                }`}
              >
                {item.title}
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">{item.message}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
