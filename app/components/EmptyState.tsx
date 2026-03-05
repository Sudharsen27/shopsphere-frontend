"use client";

import Link from "next/link";

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel: string;
  actionHref: string;
  className?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] " +
        className
      }
    >
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[var(--card-border)]/30 text-[var(--muted)] mb-6">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-[var(--muted)] text-sm max-w-sm mb-6">
          {description}
        </p>
      )}
      <Link
        href={actionHref}
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-[var(--accent)] hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
