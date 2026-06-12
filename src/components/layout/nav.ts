import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Sparkles,
  Wallet,
  Receipt,
  Boxes,
  BarChart3,
  Settings,
  HandCoins,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const navItems: NavItem[] = [
  { to: "/", label: "Inicio", icon: LayoutDashboard, end: true },
  { to: "/agenda", label: "Agenda operativa", icon: CalendarDays },
  { to: "/pacientes", label: "Pacientes", icon: Users },
  { to: "/tratamientos", label: "Tratamientos", icon: Sparkles },
  { to: "/caja", label: "Caja", icon: Wallet },
  { to: "/liquidaciones", label: "Liquidaciones", icon: HandCoins },
  { to: "/egresos", label: "Egresos", icon: Receipt },
  { to: "/inventario", label: "Inventario", icon: Boxes },
  { to: "/reportes", label: "Reportes", icon: BarChart3 },
  { to: "/guia", label: "Guía de demo", icon: HelpCircle },
  { to: "/configuracion", label: "Configuración", icon: Settings },
];
