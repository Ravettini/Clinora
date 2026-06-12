import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <Compass className="h-8 w-8" />
      </span>
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Página no encontrada</h1>
        <p className="mt-1 text-sm text-ink-500">
          La sección que buscás no existe en esta demo.
        </p>
      </div>
      <Link to="/" className="btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}
