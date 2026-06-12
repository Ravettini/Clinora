import { cn } from "@/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex max-w-full gap-1 overflow-x-auto scrollbar-none", className)}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition",
              isActive
                ? "bg-brand-600 text-white shadow-soft"
                : "text-ink-500 hover:bg-surface-subtle hover:text-ink-900",
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs font-bold",
                  isActive ? "bg-white/20 text-white" : "bg-surface-subtle text-ink-500",
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex rounded-xl bg-surface-subtle p-1 text-sm font-semibold",
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 transition",
            value === o.value
              ? "bg-white text-brand-700 shadow-soft"
              : "text-ink-500 hover:text-ink-900",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
