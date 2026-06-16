import { NavLink } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { navItems } from "./nav";
import { cn } from "@/utils/cn";
import { useUI } from "@/store/UIContext";
import { tenant } from "@/auth/tenants";

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-soft">
        <Plus className="h-5 w-5" strokeWidth={2.6} />
      </div>
      <div className="leading-tight">
        <p className="text-base font-extrabold tracking-tight text-ink-900">{tenant.brand.name}</p>
        <p className="text-[10px] font-medium text-ink-400">{tenant.brand.tagline}</p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="mt-6 flex-1 space-y-0.5 px-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              isActive
                ? "bg-brand-50 text-brand-700"
                : "text-ink-500 hover:bg-surface-subtle hover:text-ink-900",
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={cn("h-5 w-5 shrink-0", isActive && "text-brand-600")}
              />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function Sidebar() {
  const { openNewIncome } = useUI();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-900/5 bg-surface lg:flex">
      <div className="pt-5">
        <Brand />
      </div>
      <NavList />
      <div className="p-3">
        <button
          onClick={() => openNewIncome()}
          className="btn-primary w-full"
        >
          <Plus className="h-4 w-4" /> Nuevo ingreso
        </button>
      </div>
    </aside>
  );
}

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-72 flex-col bg-surface shadow-pop animate-slide-up">
        <div className="flex items-center justify-between pr-3 pt-5">
          <Brand />
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-surface-subtle"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavList onNavigate={onClose} />
      </aside>
    </div>
  );
}
