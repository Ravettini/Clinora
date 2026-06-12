import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  DollarSign,
  Building2,
  Check,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import { branches } from "@/data/mockBranches";
import { patients as allPatients } from "@/data/mockPatients";
import { formatNumber } from "@/utils/format";
import { cn } from "@/utils/cn";
import type { BranchId } from "@/types";

const notifications = [
  { id: 1, title: "Stock crítico", detail: "Toxina botulínica 100 U bajo el mínimo", tone: "danger" },
  { id: 2, title: "Pago pendiente", detail: "Lucía Fernández — Surcos nasogenianos", tone: "warning" },
  { id: 3, title: "Liquidación lista", detail: "1ª quincena de Junio generada", tone: "info" },
];

export function Header({ onMenu }: { onMenu: () => void }) {
  const { branchId, setBranchId, fxRate } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [branchOpen, setBranchOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const branch = branches.find((b) => b.id === branchId) ?? branches[0];

  const results = search.trim().length >= 2
    ? allPatients
        .filter(
          (p) =>
            p.fullName.toLowerCase().includes(search.toLowerCase()) ||
            p.dni.replace(/\./g, "").includes(search.replace(/\./g, "")),
        )
        .slice(0, 6)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setBranchOpen(false);
        setBellOpen(false);
        setResultsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      ref={containerRef}
      className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-ink-900/5 bg-surface/90 px-4 backdrop-blur sm:gap-3 sm:px-6"
    >
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-ink-500 hover:bg-surface-subtle lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Global search */}
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setResultsOpen(true);
          }}
          onFocus={() => setResultsOpen(true)}
          placeholder="Buscar paciente, DNI…"
          className="input pl-9"
        />
        {resultsOpen && results.length > 0 && (
          <div className="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-xl border border-ink-900/5 bg-white shadow-pop animate-fade-in">
            {results.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  navigate(`/pacientes/${p.id}`);
                  setSearch("");
                  setResultsOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-surface-muted"
              >
                <span className="font-medium text-ink-900">{p.fullName}</span>
                <span className="text-xs text-ink-400">DNI {p.dni}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* FX indicator */}
      <div className="hidden items-center gap-1.5 rounded-xl bg-positive-50 px-3 py-1.5 text-sm font-semibold text-positive-700 sm:flex">
        <DollarSign className="h-4 w-4" />
        <span>1 USD = ${formatNumber(fxRate)}</span>
      </div>

      {/* Branch selector */}
      <div className="relative">
        <button
          onClick={() => {
            setBranchOpen((v) => !v);
            setBellOpen(false);
          }}
          className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-surface-subtle"
        >
          <Building2 className="h-4 w-4 text-brand-500" />
          <span className="hidden sm:inline">{branch.name}</span>
          <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
        </button>
        {branchOpen && (
          <div className="absolute right-0 top-12 z-40 w-52 overflow-hidden rounded-xl border border-ink-900/5 bg-white shadow-pop animate-fade-in">
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setBranchId(b.id as BranchId);
                  setBranchOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-surface-muted"
              >
                <span className="font-medium text-ink-900">{b.name}</span>
                {b.id === branchId && <Check className="h-4 w-4 text-brand-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => {
            setBellOpen((v) => !v);
            setBranchOpen(false);
          }}
          className="relative rounded-xl p-2 text-ink-500 transition hover:bg-surface-subtle"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
        </button>
        {bellOpen && (
          <div className="absolute right-0 top-12 z-40 w-72 overflow-hidden rounded-xl border border-ink-900/5 bg-white shadow-pop animate-fade-in">
            <div className="border-b border-ink-900/5 px-4 py-2.5 text-sm font-semibold text-ink-900">
              Notificaciones
            </div>
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex gap-3 border-b border-ink-900/5 px-4 py-3 last:border-0"
              >
                <span
                  className={cn(
                    "mt-1 h-2 w-2 shrink-0 rounded-full",
                    n.tone === "danger"
                      ? "bg-danger-500"
                      : n.tone === "warning"
                        ? "bg-warning-500"
                        : "bg-brand-500",
                  )}
                />
                <div>
                  <p className="text-sm font-medium text-ink-900">{n.title}</p>
                  <p className="text-xs text-ink-400">{n.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5 pl-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-bold text-white">
          VR
        </div>
        <div className="hidden leading-tight md:block">
          <p className="text-sm font-semibold text-ink-900">Dra. Valentina Ruiz</p>
          <p className="text-xs text-ink-400">Administradora</p>
        </div>
      </div>
    </header>
  );
}
