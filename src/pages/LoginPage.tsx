import { useState } from "react";
import { LogIn, Lock, User, Building2, Sparkles } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { DEMO_USERS, TENANTS } from "@/auth/tenants";
import { cn } from "@/utils/cn";

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) setError(true);
  };

  const quickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-10">
      <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-2">
        {/* Formulario */}
        <div className="card flex flex-col justify-center p-8">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-soft">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-lg font-extrabold tracking-tight text-ink-900">Iniciar sesión</p>
              <p className="text-xs text-ink-400">Demo multi-negocio</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">Usuario</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(false);
                  }}
                  placeholder="usuario"
                  autoComplete="username"
                  className="input h-11 pl-9"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink-700">Contraseña</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="input h-11 pl-9"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm font-medium text-danger-700">
                Usuario o contraseña incorrectos.
              </p>
            )}

            <button type="submit" className="btn-primary h-11 w-full">
              <LogIn className="h-4 w-4" /> Ingresar
            </button>
          </form>
        </div>

        {/* Accesos demo */}
        <div className="flex flex-col justify-center gap-3">
          <p className="px-1 text-sm font-semibold text-ink-500">Cuentas de demostración</p>
          {DEMO_USERS.map((u) => {
            const t = TENANTS[u.tenant];
            return (
              <button
                key={u.username}
                onClick={() => quickFill(u.username, u.password)}
                className={cn(
                  "card flex items-center gap-4 p-4 text-left transition hover:border-brand-300 hover:shadow-pop",
                )}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink-900">{t.brand.name}</p>
                  <p className="truncate text-xs text-ink-400">{t.brand.tagline}</p>
                  <p className="mt-1 text-xs text-ink-500">
                    <span className="font-mono font-medium text-ink-700">{u.username}</span>
                    {" · "}
                    <span className="font-mono font-medium text-ink-700">{u.password}</span>
                  </p>
                </div>
              </button>
            );
          })}
          <p className="px-1 text-xs text-ink-400">
            Tocá una cuenta para autocompletar y luego presioná “Ingresar”.
          </p>
        </div>
      </div>
    </div>
  );
}
