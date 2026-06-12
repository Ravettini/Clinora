import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatCurrency } from "@/utils/format";

const AXIS = "#8d8799";
const GRID = "#ece7f7";
export const CHART_COLORS = [
  "#7a52b0",
  "#a98ed4",
  "#e7c6d4",
  "#4ca777",
  "#d99b3c",
  "#cdb8d8",
  "#cf5b6c",
  "#8d8799",
];

interface TooltipEntry {
  name?: string;
  value?: number;
  color?: string;
}

function MoneyTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-ink-900/5 bg-white p-3 shadow-pop">
      {label && <p className="mb-1 text-xs font-semibold text-ink-900">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-ink-500">{entry.name}:</span>
          <span className="font-semibold text-ink-900">
            {formatCurrency(Number(entry.value))}
          </span>
        </div>
      ))}
    </div>
  );
}

interface RevenueLinePoint {
  month: string;
  ars: number;
  usd: number;
}

export function RevenueLineChart({ data }: { data: RevenueLinePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a52b0" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#7a52b0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="month" stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke={AXIS}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
        />
        <Tooltip content={<MoneyTooltip />} />
        <Area
          type="monotone"
          dataKey="ars"
          name="Facturación ARS"
          stroke="#7a52b0"
          strokeWidth={2.5}
          fill="url(#rev)"
        />
        <Line
          type="monotone"
          dataKey="usd"
          name="Equivalente USD"
          stroke="#d99b3c"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface DonutPoint {
  name: string;
  value: number;
  color?: string;
}

export function DonutChart({
  data,
  height = 260,
}: {
  data: DonutPoint[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color ?? CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<MoneyTooltip />} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          formatter={(value) => <span className="text-ink-500">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface BarPoint {
  label: string;
  value: number;
}

export function SimpleBarChart({
  data,
  color = "#7a52b0",
  height = 260,
}: {
  data: BarPoint[];
  color?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke={AXIS}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
        />
        <Tooltip content={<MoneyTooltip />} cursor={{ fill: "#f1eff7" }} />
        <Bar dataKey="value" name="Total" fill={color} radius={[6, 6, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBarChart({
  data,
  height = 280,
}: {
  data: BarPoint[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
        <XAxis
          type="number"
          stroke={AXIS}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
        />
        <YAxis
          type="category"
          dataKey="label"
          stroke={AXIS}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <Tooltip content={<MoneyTooltip />} cursor={{ fill: "#f1eff7" }} />
        <Bar dataKey="value" name="Facturación" radius={[0, 6, 6, 0]} maxBarSize={26}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface StackedPoint {
  name: string;
  [key: string]: string | number;
}

export function StackedBarChart({
  data,
  keys,
  height = 280,
}: {
  data: StackedPoint[];
  keys: { key: string; label: string; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="name" stroke={AXIS} fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          stroke={AXIS}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
        />
        <Tooltip content={<MoneyTooltip />} cursor={{ fill: "#f1eff7" }} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          formatter={(value) => <span className="text-ink-500">{value}</span>}
        />
        {keys.map((k, i) => (
          <Bar
            key={k.key}
            dataKey={k.key}
            name={k.label}
            stackId="a"
            fill={k.color}
            radius={i === keys.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
            maxBarSize={42}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function EbitdaLineChart({
  data,
}: {
  data: { month: string; ebitda: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="month" stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke={AXIS}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
        />
        <Tooltip content={<MoneyTooltip />} />
        <Line
          type="monotone"
          dataKey="ebitda"
          name="EBITDA"
          stroke="#4ca777"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#4ca777" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PriceLineChart({
  data,
}: {
  data: { date: string; price: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="date" stroke={AXIS} fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          stroke={AXIS}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(Number(v))}
        />
        <Tooltip content={<MoneyTooltip />} />
        <Line
          type="monotone"
          dataKey="price"
          name="Precio unitario"
          stroke="#7a52b0"
          strokeWidth={2.5}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
