import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  actions,
  children,
  className,
}: ChartCardProps) {
  return (
    <div className={`card min-w-0 p-5 ${className ?? ""}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-ink-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
