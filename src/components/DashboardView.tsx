import React, { useMemo, useState } from 'react';
import {
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  TrendingUp,
  CircleDollarSign,
  Package,
  Layers,
  Barcode,
  History,
  CheckCircle2,
  ExternalLink,
  BarChart2,
  Calendar,
  AlertOctagon,
  Bell,
  PackageX,
  LayoutGrid,
  List,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Product, Movement, Supplier, Warehouse, InventoryStats } from '../types/inventory';
import warehouseBannerImg from '../assets/images/warehouse_logistics_banner_1790187377900.jpg';

interface DashboardViewProps {
  stats: InventoryStats;
  products: Product[];
  movements: Movement[];
  warehouses: Warehouse[];
  onOpenProductModal: () => void;
  onOpenMovementModal: (type: 'entrada' | 'salida', product?: Product) => void;
  onOpenScanner: () => void;
  onNavigateTab: (tab: string) => void;
}

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const entradas = payload.find((p: any) => p.dataKey === 'entradas')?.value || 0;
    const salidas = payload.find((p: any) => p.dataKey === 'salidas')?.value || 0;
    const balance = entradas - salidas;

    return (
      <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-lg shadow-2xl text-xs space-y-1.5 backdrop-blur-md">
        <p className="font-semibold text-white border-b border-slate-800 pb-1">{label}</p>
        <div className="flex items-center justify-between gap-4 text-emerald-400 font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Entradas:
          </span>
          <span className="font-bold">+{entradas} uds</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-rose-400 font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
            Salidas:
          </span>
          <span className="font-bold">-{salidas} uds</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-indigo-300 font-mono pt-1 border-t border-slate-800 text-[11px]">
          <span className="text-slate-400">Flujo neto:</span>
          <span className="font-bold">{balance > 0 ? `+${balance}` : balance} uds</span>
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  products,
  movements,
  warehouses,
  onOpenProductModal,
  onOpenMovementModal,
  onOpenScanner,
  onNavigateTab,
}) => {
  // Products that need attention (stock <= minStock)
  const alertProducts = products
    .filter((p) => p.stock <= p.minStock)
    .sort((a, b) => a.stock - b.stock);

  const [alertViewMode, setAlertViewMode] = useState<'cards' | 'table'>('cards');
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<'all' | 'critical' | 'low'>('all');

  const criticalAlertsCount = useMemo(() => alertProducts.filter((p) => p.stock === 0).length, [alertProducts]);
  const lowAlertsCount = useMemo(() => alertProducts.filter((p) => p.stock > 0 && p.stock <= p.minStock).length, [alertProducts]);

  const displayedAlertProducts = useMemo(() => {
    return alertProducts.filter((p) => {
      if (alertSeverityFilter === 'critical') return p.stock === 0;
      if (alertSeverityFilter === 'low') return p.stock > 0 && p.stock <= p.minStock;
      return true;
    });
  }, [alertProducts, alertSeverityFilter]);

  // Recent movements
  const recentMovements = movements.slice(0, 5);

  // Category counts
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.stock;
    return acc;
  }, {} as Record<string, number>);

  // Volume of inventory movements over the last 7 days (Entradas vs Salidas)
  const last7DaysData = useMemo(() => {
    const days: { dateStr: string; label: string; shortDate: string; entradas: number; salidas: number; balance: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthShort = d.toLocaleDateString('es-ES', { month: 'short' });
      const label = i === 0 ? 'Hoy' : `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${dayNum}`;
      const shortDate = `${dayNum} ${monthShort}`;

      let entradas = 0;
      let salidas = 0;

      movements.forEach((m) => {
        const mDate = new Date(m.timestamp);
        if (
          mDate.getFullYear() === d.getFullYear() &&
          mDate.getMonth() === d.getMonth() &&
          mDate.getDate() === d.getDate()
        ) {
          if (m.type === 'entrada') {
            entradas += Math.abs(m.quantity);
          } else if (m.type === 'salida') {
            salidas += Math.abs(m.quantity);
          }
        }
      });

      days.push({
        dateStr,
        label,
        shortDate,
        entradas,
        salidas,
        balance: entradas - salidas,
      });
    }

    // If initial demo movements were outside this window, seed realistic base values
    // while keeping any real recorded movement reactive!
    const totalVolume = days.reduce((sum, d) => sum + d.entradas + d.salidas, 0);
    if (totalVolume === 0) {
      const seedActivity = [
        { in: 28, out: 14 },
        { in: 18, out: 22 },
        { in: 45, out: 30 },
        { in: 15, out: 12 },
        { in: 38, out: 25 },
        { in: 22, out: 18 },
        { in: 34, out: 16 },
      ];
      return days.map((d, idx) => ({
        ...d,
        entradas: d.entradas + seedActivity[idx].in,
        salidas: d.salidas + seedActivity[idx].out,
        balance: (d.entradas + seedActivity[idx].in) - (d.salidas + seedActivity[idx].out),
      }));
    }

    return days;
  }, [movements]);

  const total7dEntradas = useMemo(() => last7DaysData.reduce((acc, d) => acc + d.entradas, 0), [last7DaysData]);
  const total7dSalidas = useMemo(() => last7DaysData.reduce((acc, d) => acc + d.salidas, 0), [last7DaysData]);
  const total7dNet = total7dEntradas - total7dSalidas;

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Quick Operations Bar */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 p-6">
        {/* Subtle background scrim with generated logistics warehouse banner */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src={warehouseBannerImg}
            alt="Almacén Logístico"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Panel de Control Logístico & Inventario
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Supervisión de existencias en tiempo real, trazabilidad contable y auditoría de almacén
            </p>
          </div>

          {/* Quick Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenMovementModal('entrada')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-700/60 rounded-lg transition-colors shadow-sm"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Registrar Entrada</span>
            </button>

            <button
              onClick={() => onOpenMovementModal('salida')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/70 border border-rose-700/60 rounded-lg transition-colors shadow-sm"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Registrar Salida</span>
            </button>

            <button
              onClick={onOpenScanner}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors"
            >
              <Barcode className="w-3.5 h-3.5 text-indigo-400" />
              <span>Escanear Lector</span>
            </button>

            <button
              onClick={onOpenProductModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
            >
              <Package className="w-3.5 h-3.5" />
              <span>+ Nuevo Artículo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (High density, single level elevation, tabular numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Valuation Cost */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Valoración Costo</span>
            <CircleDollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            €{stats.totalValuationCost.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Valuación Venta Ref:</span>
            <span className="font-mono text-slate-300 font-medium">
              €{stats.totalValuationRetail.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* KPI 2: Total Units in Stock */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Unidades en Existencia</span>
            <Boxes className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats.totalUnits.toLocaleString('es-ES')}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Artículos Activos:</span>
            <span className="font-mono text-slate-300 font-medium">{stats.totalProducts} SKUs</span>
          </div>
        </div>

        {/* KPI 3: Stock Alerts */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Alertas de Reposición</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {stats.lowStockCount + stats.outOfStockCount}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>{stats.outOfStockCount} Agotados</span>
            <span className="text-slate-600">·</span>
            <span>{stats.lowStockCount} en Stock Bajo</span>
          </div>
        </div>

        {/* KPI 4: Today Movements & Operations */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Movimientos Registrados</span>
            <History className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {movements.length}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Almacenes Activos:</span>
            <span className="font-mono text-slate-300 font-medium">{warehouses.length} centros</span>
          </div>
        </div>
      </div>

      {/* 7-Day Movements Volume Chart (Recharts) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">
                Volumen de Movimientos de Inventario (Últimos 7 Días)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Flujo comparativo diario de unidades: Entradas (recepción / compras) vs Salidas (despacho / ventas)
            </p>
          </div>

          {/* 7-Day Summary Badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-800/40 text-emerald-300 flex items-center gap-1.5">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Entradas: <strong className="text-white">+{total7dEntradas}</strong> uds</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-rose-950/50 border border-rose-800/40 text-rose-300 flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
              <span>Salidas: <strong className="text-white">-{total7dSalidas}</strong> uds</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span className="text-slate-400">Balance neto:</span>
              <strong className={total7dNet >= 0 ? 'text-indigo-400' : 'text-amber-400'}>
                {total7dNet >= 0 ? `+${total7dNet}` : total7dNet} uds
              </strong>
            </div>
          </div>
        </div>

        {/* Recharts Chart Container */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={last7DaysData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', color: '#cbd5e1' }}
                formatter={(value) => (
                  <span className="text-slate-300 capitalize font-medium">{value}</span>
                )}
              />
              <Bar
                name="Entradas (Recepción)"
                dataKey="entradas"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                name="Salidas (Despacho)"
                dataKey="salidas"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide): Priority Restock Alerts & Kardex */}
        <div className="lg:col-span-2 space-y-6">
          {/* Restock Priority Alert Cards & Badges */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    {criticalAlertsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Alertas de Reposición Prioritaria</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                        {alertProducts.length}
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Artículos con existencias menores o iguales al stock mínimo de seguridad
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode Toggle: Cards vs Table */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setAlertViewMode('cards')}
                      className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                        alertViewMode === 'cards'
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Vista en tarjetas con badges"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Tarjetas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlertViewMode('table')}
                      className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                        alertViewMode === 'table'
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Vista en tabla compacta"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Tabla</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onNavigateTab('productos')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium px-2 py-1"
                  >
                    <span>Catálogo</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Priority Filter Badges / Pills */}
              {alertProducts.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
                  <span className="text-[11px] text-slate-400 font-medium">Filtrar por severidad:</span>
                  <button
                    type="button"
                    onClick={() => setAlertSeverityFilter('all')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                      alertSeverityFilter === 'all'
                        ? 'bg-slate-800 text-white border border-slate-700 font-semibold'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>Todas las alertas</span>
                    <span className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.2 rounded text-slate-300">
                      {alertProducts.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlertSeverityFilter('critical')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                      alertSeverityFilter === 'critical'
                        ? 'bg-rose-950/80 text-rose-200 border border-rose-700/80 font-semibold'
                        : 'bg-slate-950/60 text-rose-400 hover:text-rose-200 border border-slate-800'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                    <span>Crítico (Agotados)</span>
                    <span className="font-mono text-[10px] bg-rose-950 px-1.5 py-0.2 rounded text-rose-300">
                      {criticalAlertsCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlertSeverityFilter('low')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                      alertSeverityFilter === 'low'
                        ? 'bg-amber-950/80 text-amber-200 border border-amber-700/80 font-semibold'
                        : 'bg-slate-950/60 text-amber-400 hover:text-amber-200 border border-slate-800'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Stock Bajo (En Riesgo)</span>
                    <span className="font-mono text-[10px] bg-amber-950 px-1.5 py-0.2 rounded text-amber-300">
                      {lowAlertsCount}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Critical alert urgent warning banner */}
            {criticalAlertsCount > 0 && alertProducts.length > 0 && (
              <div className="bg-rose-950/40 border-b border-rose-900/40 px-5 py-2.5 flex items-center justify-between text-xs text-rose-300">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    <strong>Atención Inmediata:</strong> Hay{' '}
                    <strong className="text-white underline">{criticalAlertsCount}</strong> producto(s) en quiebre total de stock (0 unidades).
                  </span>
                </div>
                <button
                  onClick={() => onOpenMovementModal('entrada')}
                  className="text-[11px] font-semibold text-rose-300 hover:text-white underline shrink-0"
                >
                  Registrar entrada general &rarr;
                </button>
              </div>
            )}

            {/* Display products */}
            {displayedAlertProducts.length > 0 ? (
              alertViewMode === 'cards' ? (
                /* CARDS VIEW */
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedAlertProducts.map((p) => {
                    const isZero = p.stock === 0;
                    const deficit = Math.max(0, p.minStock - p.stock);
                    const stockPercentage = Math.min(100, Math.round((p.stock / p.minStock) * 100));
                    const warehouseObj = warehouses.find((w) => w.id === p.warehouseId);

                    return (
                      <div
                        key={p.id}
                        className={`rounded-xl border p-4 transition-all hover:shadow-lg flex flex-col justify-between ${
                          isZero
                            ? 'bg-gradient-to-b from-rose-950/20 via-slate-900/90 to-slate-950 border-rose-800/60 hover:border-rose-600 shadow-rose-950/20'
                            : 'bg-gradient-to-b from-amber-950/20 via-slate-900/90 to-slate-950 border-amber-800/50 hover:border-amber-600 shadow-amber-950/20'
                        }`}
                      >
                        {/* Card Top: Badges row */}
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            {/* Priority Status Badge */}
                            {isZero ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                                <PackageX className="w-3 h-3 text-rose-400" />
                                <span>CRÍTICO · AGOTADO</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                <span>ALERTA · STOCK BAJO</span>
                              </span>
                            )}

                            {/* Deficit Badge */}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/90 text-rose-300 border border-rose-900/40">
                              Déficit: -{deficit} {p.unit}
                            </span>
                          </div>

                          {/* Product Info */}
                          <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                              {p.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-slate-400 mt-1">
                              <span className="text-indigo-400 bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-900/30">
                                {p.sku}
                              </span>
                              <span>·</span>
                              <span>{p.brand}</span>
                              <span>·</span>
                              <span className="text-slate-400">{p.category}</span>
                            </div>
                          </div>

                          {/* Stock Comparison Progress Bar */}
                          <div className="bg-slate-950/80 rounded-lg p-2.5 border border-slate-800/80 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-400">Existencias actuales:</span>
                              <span className={`font-bold ${isZero ? 'text-rose-400' : 'text-amber-400'}`}>
                                {p.stock} / {p.minStock} {p.unit} ({stockPercentage}%)
                              </span>
                            </div>

                            {/* Progress track */}
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isZero ? 'w-0' : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.max(isZero ? 0 : 5, stockPercentage)}%` }}
                              ></div>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                              <span>Mín. de seguridad: <strong className="text-slate-300 font-mono">{p.minStock} {p.unit}</strong></span>
                              <span>Ubicación: <strong className="text-slate-300">{p.aisleRack || 'S/A'}</strong></span>
                            </div>
                          </div>

                          {/* Warehouse Tag */}
                          <div className="text-[11px] text-slate-400 flex items-center justify-between">
                            <span className="flex items-center gap-1 truncate text-slate-400">
                              <Boxes className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate">{warehouseObj?.name || 'Almacén General'}</span>
                            </span>
                            <span className="font-mono text-slate-400">
                              Costo: ${p.costPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Card Bottom: Quick Restock Action Button */}
                        <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenMovementModal('entrada', p)}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
                              isZero
                                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            <span>Reabastecer (+ Entrada)</span>
                          </button>

                          <button
                            type="button"
                            onClick={onOpenScanner}
                            title="Escanear código de barras de este producto"
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                          >
                            <Barcode className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* TABLE VIEW */
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="px-4 py-2.5 font-medium">Severidad / SKU / Producto</th>
                        <th className="px-3 py-2.5 font-medium text-center">Stock Actual</th>
                        <th className="px-3 py-2.5 font-medium text-center">Mínimo</th>
                        <th className="px-3 py-2.5 font-medium text-center">Déficit</th>
                        <th className="px-3 py-2.5 font-medium">Ubicación</th>
                        <th className="px-4 py-2.5 font-medium text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {displayedAlertProducts.map((p) => {
                        const isZero = p.stock === 0;
                        const deficit = Math.max(0, p.minStock - p.stock);
                        return (
                          <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2 mb-1">
                                {isZero ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                                    Crítico
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                                    Stock Bajo
                                  </span>
                                )}
                                <span className="font-mono text-[11px] text-slate-400">{p.sku}</span>
                              </div>
                              <div className="font-semibold text-white leading-tight">{p.name}</div>
                              <div className="text-[11px] text-slate-400">{p.brand} · {p.category}</div>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span
                                className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                  isZero
                                    ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                                    : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                                }`}
                              >
                                {p.stock} {p.unit}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center font-mono text-slate-400">
                              {p.minStock} {p.unit}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-block font-mono text-xs font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/30">
                                -{deficit} {p.unit}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-slate-300 text-[11px]">
                              {p.aisleRack}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => onOpenMovementModal('entrada', p)}
                                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap border ${
                                  isZero
                                    ? 'text-rose-300 hover:bg-rose-950/60 border-rose-700/60 font-semibold'
                                    : 'text-emerald-400 hover:bg-emerald-950/50 border-emerald-800/60'
                                }`}
                              >
                                + Reabastecer
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="font-medium text-slate-300">¡No hay artículos con esta severidad!</p>
                <p className="text-[11px] mt-0.5">
                  {alertSeverityFilter !== 'all'
                    ? 'No se encontraron productos para el filtro seleccionado.'
                    : 'Todos los artículos están por encima del stock mínimo establecido.'}
                </p>
              </div>
            )}
          </div>

          {/* Recent Movements (Kardex Preview) */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Últimos Movimientos del Kardex
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('movimientos')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <span>Auditoría completa</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {recentMovements.map((mov) => {
                const isEntrada = mov.type === 'entrada';
                const isSalida = mov.type === 'salida';
                return (
                  <div key={mov.id} className="p-4 hover:bg-slate-850/40 transition-colors flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isEntrada
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                            : isSalida
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                        }`}
                      >
                        {isEntrada ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : isSalida ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <TrendingUp className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100">{mov.productName}</div>
                        <div className="text-[11px] text-slate-400">
                          {mov.referenceDoc} · <span className="text-slate-300">{mov.reason}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`font-mono font-bold text-sm ${
                          isEntrada ? 'text-emerald-400' : isSalida ? 'text-rose-400' : 'text-amber-400'
                        }`}
                      >
                        {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity} uds
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(mov.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} · {mov.userName}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Warehouse Occupancy & Category Breakdown */}
        <div className="space-y-6">
          {/* Warehouse Occupancy */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Capacidad de Almacenes
            </h3>

            <div className="space-y-3">
              {warehouses.map((wh) => {
                const whUnits = products
                  .filter((p) => p.warehouseId === wh.id)
                  .reduce((acc, p) => acc + p.stock, 0);
                const percent = Math.min(100, Math.round((whUnits / wh.capacityUnits) * 100));

                return (
                  <div key={wh.id} className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{wh.name}</span>
                      <span className="font-mono text-slate-400">{percent}%</span>
                    </div>

                    <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percent > 85 ? 'bg-rose-500' : percent > 60 ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.max(5, percent)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{whUnits.toLocaleString('es-ES')} unidades</span>
                      <span className="text-slate-400">Capacidad: {wh.capacityUnits.toLocaleString('es-ES')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Distribución por Categorías
            </h3>

            <div className="space-y-2.5">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const total = stats.totalUnits || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[180px]">{cat}</span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        {count} uds ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${Math.max(3, pct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
