import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="rounded-2xl bg-surface-subtle p-4 text-brand-400">
        <Icon className="h-7 w-7" />
      </span>
      <div>
        <p className="font-semibold text-ink-700">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
