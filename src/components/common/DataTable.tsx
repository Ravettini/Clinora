import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  renderMobileCard?: (row: T) => ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

const alignCls = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  renderMobileCard,
  emptyTitle = "Sin resultados",
  emptyDescription = "No se encontraron registros con los filtros aplicados.",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="card">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div
        className={cn(
          "card overflow-hidden",
          renderMobileCard ? "hidden md:block" : "block overflow-x-auto",
        )}
      >
        <table className="w-full min-w-full text-sm">
          <thead>
            <tr className="border-b border-ink-900/5 bg-surface-muted/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400",
                    alignCls[col.align ?? "left"],
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-ink-900/5 last:border-0 transition",
                  onRowClick && "cursor-pointer hover:bg-surface-muted/70",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-ink-700",
                      alignCls[col.align ?? "left"],
                      col.className,
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      {renderMobileCard && (
        <div className="space-y-2.5 md:hidden">
          {data.map((row) => (
            <div key={rowKey(row)} onClick={() => onRowClick?.(row)}>
              {renderMobileCard(row)}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
