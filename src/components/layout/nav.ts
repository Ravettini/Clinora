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
import { navLabel } from "@/auth/tenants";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const navItems: NavItem[] = [
  { to: "/", label: navLabel("/", "Inicio"), icon: LayoutDashboard, end: true },
  { to: "/agenda", label: navLabel("/agenda", "Agenda operativa"), icon: CalendarDays },
  { to: "/pacientes", label: navLabel("/pacientes", "Pacientes"), icon: Users },
  { to: "/tratamientos", label: navLabel("/tratamientos", "Tratamientos"), icon: Sparkles },
  { to: "/caja", label: navLabel("/caja", "Caja"), icon: Wallet },
  { to: "/liquidaciones", label: navLabel("/liquidaciones", "Liquidaciones"), icon: HandCoins },
  { to: "/egresos", label: navLabel("/egresos", "Egresos"), icon: Receipt },
  { to: "/inventario", label: navLabel("/inventario", "Inventario"), icon: Boxes },
  { to: "/reportes", label: navLabel("/reportes", "Reportes"), icon: BarChart3 },
  { to: "/guia", label: navLabel("/guia", "Guía de demo"), icon: HelpCircle },
  { to: "/configuracion", label: navLabel("/configuracion", "Configuración"), icon: Settings },
];
