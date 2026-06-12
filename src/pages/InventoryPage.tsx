import { useMemo, useState } from "react";
import { AlertTriangle, Package } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs } from "@/components/common/Tabs";
import { DataTable } from "@/components/common/DataTable";
import { InventoryStatusBadge } from "@/components/common/StatusBadge";
import { PriceLineChart } from "@/components/charts";
import { inventoryItems } from "@/data/mockInventory";
import { inventoryMovements } from "@/data/mockInventoryMovements";
import { suppliers } from "@/data/mockSuppliers";
import { getInventoryStatus } from "@/utils/calculations";
import { movementTypeLabels } from "@/utils/labels";
import { formatCurrency, formatDate } from "@/utils/format";
import type { InventoryItem } from "@/types";

const tabs = [
  { id: "stock", label: "Stock" },
  { id: "movimientos", label: "Movimientos" },
  { id: "compras", label: "Compras" },
  { id: "proveedores", label: "Proveedores" },
  { id: "alertas", label: "Alertas" },
];

export function InventoryPage() {
  const [tab, setTab] = useState("stock");
  const [selected, setSelected] = useState<InventoryItem | null>(null);

  const alerts = useMemo(
    () => inventoryItems.filter((i) => ["bajo", "sin_stock"].includes(getInventoryStatus(i))),
    [],
  );

  return (
    <div className="space-y-5">
      <PageHeader title="Inventario" subtitle="Stock, movimientos y proveedores" />

      {alerts.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-warning-100 bg-warning-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-warning-600" />
          <div>
            <p className="text-sm font-semibold text-warning-700">
              {alerts.length} productos con stock crítico
            </p>
            <p className="text-xs text-warning-600">
              {alerts.map((a) => a.name).slice(0, 3).join(" · ")}
              {alerts.length > 3 && "…"}
            </p>
          </div>
        </div>
      )}

      <Tabs tabs={tabs.map((t) => t.id === "alertas" ? { ...t, count: alerts.length } : t)} active={tab} onChange={setTab} />

      {tab === "stock" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DataTable
              columns={[
                { key: "name", header: "Producto", render: (i: InventoryItem) => <span className="font-medium">{i.name}</span> },
                { key: "code", header: "Código", render: (i: InventoryItem) => <span className="font-mono text-xs">{i.code}</span> },
                { key: "stock", header: "Stock", align: "center", render: (i: InventoryItem) => `${i.stock} ${i.unit}` },
                { key: "min", header: "Mín.", align: "center", render: (i: InventoryItem) => i.minStock },
                { key: "cost", header: "Costo prom.", align: "right", render: (i: InventoryItem) => formatCurrency(i.avgCost) },
                { key: "status", header: "Estado", render: (i: InventoryItem) => <InventoryStatusBadge status={getInventoryStatus(i)} /> },
              ]}
              data={inventoryItems}
              rowKey={(i) => i.id}
              onRowClick={setSelected}
            />
          </div>
          <div className="card p-5">
            {selected ? (
              <>
                <h3 className="font-semibold text-ink-900">{selected.name}</h3>
                <p className="text-xs text-ink-400">Evolución de precio</p>
                <div className="mt-3">
                  <PriceLineChart
                    data={selected.priceHistory.map((h) => ({
                      date: formatDate(h.date, "dd/MM"),
                      price: h.unitPrice,
                    }))}
                  />
                </div>
                <div className="mt-3 space-y-1 text-xs text-ink-500">
                  <p>Último precio: {formatCurrency(selected.lastPrice)}</p>
                  <p>Costo promedio: {formatCurrency(selected.avgCost)}</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-ink-400">
                <Package className="h-8 w-8 text-brand-300" />
                Seleccioná un producto para ver el detalle.
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "movimientos" && (
        <DataTable
          columns={[
            { key: "date", header: "Fecha", render: (m) => formatDate(m.date) },
            { key: "item", header: "Producto", render: (m) => inventoryItems.find((i) => i.id === m.itemId)?.name ?? m.itemId },
            { key: "type", header: "Tipo", render: (m) => movementTypeLabels[m.type] },
            { key: "qty", header: "Cantidad", align: "right", render: (m) => m.quantity },
            { key: "ref", header: "Referencia", render: (m) => <span className="text-xs text-ink-400">{m.reference}</span> },
          ]}
          data={inventoryMovements.slice(0, 60)}
          rowKey={(m) => m.id}
        />
      )}

      {tab === "compras" && (
        <DataTable
          columns={[
            { key: "date", header: "Fecha", render: (m) => formatDate(m.date) },
            { key: "item", header: "Producto", render: (m) => inventoryItems.find((i) => i.id === m.itemId)?.name ?? "" },
            { key: "qty", header: "Cantidad", align: "right", render: (m) => m.quantity },
            { key: "ref", header: "Orden", render: (m) => m.reference },
          ]}
          data={inventoryMovements.filter((m) => m.type === "ingreso_compra").slice(0, 30)}
          rowKey={(m) => m.id}
        />
      )}

      {tab === "proveedores" && (
        <DataTable
          columns={[
            { key: "name", header: "Proveedor", render: (s) => <span className="font-medium">{s.name}</span> },
            { key: "category", header: "Categoría", render: (s) => s.category },
            { key: "contact", header: "Contacto", render: (s) => s.contact },
            { key: "phone", header: "Teléfono", render: (s) => s.phone },
            { key: "email", header: "Email", render: (s) => <span className="text-xs">{s.email}</span> },
          ]}
          data={suppliers}
          rowKey={(s) => s.id}
        />
      )}

      {tab === "alertas" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {alerts.map((item) => (
            <div key={item.id} className="card flex items-start gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger-600">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-ink-900">{item.name}</p>
                <p className="text-xs text-ink-400">
                  Stock: {item.stock} {item.unit} · Mínimo: {item.minStock}
                </p>
                <InventoryStatusBadge status={getInventoryStatus(item)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
