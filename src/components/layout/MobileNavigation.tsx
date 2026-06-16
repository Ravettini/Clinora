import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Plus, Users, Menu } from "lucide-react";
import { cn } from "@/utils/cn";
import { useUI } from "@/store/UIContext";
import { navLabel } from "@/auth/tenants";

const items = [
  { to: "/", label: navLabel("/", "Inicio"), icon: LayoutDashboard, end: true },
  { to: "/agenda", label: navLabel("/agenda", "Agenda"), icon: CalendarDays },
];

const items2 = [
  { to: "/pacientes", label: navLabel("/pacientes", "Pacientes"), icon: Users },
];

export function MobileNavigation({ onMore }: { onMore: () => void }) {
  const { openNewIncome } = useUI();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-ink-900/5 bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur lg:hidden">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex w-16 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium transition",
              isActive ? "text-brand-700" : "text-ink-400",
            )
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}

      <button
        onClick={() => openNewIncome()}
        className="flex flex-col items-center gap-0.5"
      >
        <span className="flex h-11 w-11 -translate-y-2 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-pop">
          <Plus className="h-6 w-6" />
        </span>
      </button>

      {items2.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex w-16 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium transition",
              isActive ? "text-brand-700" : "text-ink-400",
            )
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}

      <button
        onClick={onMore}
        className="flex w-16 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium text-ink-400"
      >
        <Menu className="h-5 w-5" />
        Más
      </button>
    </nav>
  );
}
