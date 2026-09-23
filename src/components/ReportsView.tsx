import React from 'react';
import {
  TrendingUp,
  CircleDollarSign,
  PieChart,
  BarChart3,
  Download,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Boxes,
  DatabaseBackup,
} from 'lucide-react';
import { Product, Movement, Supplier, Warehouse, InventoryStats } from '../types/inventory';
import { exportBackupJSON } from '../services/storage';

interface ReportsViewProps {
  stats: InventoryStats;
  products: Product[];
  movements: Movement[];
  suppliers: Supplier[];
  warehouses: Warehouse[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ stats, products, movements, suppliers, warehouses }) => {
  // Profit calculations
  const totalCost = stats.totalValuationCost;
  const totalRetail = stats.totalValuationRetail;
  const potentialGrossProfit = totalRetail - totalCost;
  const marginPct = totalCost > 0 ? ((potentialGrossProfit / totalCost) * 100).toFixed(1) : '0.0';

  // Top 5 inventory by total cost value (stock * costPrice)
  const topValuedProducts = [...products]
    .map((p) => ({ ...p, totalValue: p.stock * p.costPrice }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  // Top movement activity items
  const productMovementCounts = movements.reduce((acc, m) => {
    acc[m.productName] = (acc[m.productName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topActiveProducts = Object.entries(productMovementCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Informes Financieros & Auditoría</h1>
          <p className="text-xs text-slate-400">
            Valuación patrimonial, rotación de activos y análisis de rentabilidad bruta
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportBackupJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors"
            title="Descargar copia íntegra de la base de datos en JSON"
          >
            <DatabaseBackup className="w-3.5 h-3.5 text-indigo-400" />
            <span>Respaldo JSON Completo</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Informe Ejecutivo</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header (only visible on print) */}
      <div className="hidden print-only mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">StockMaster Pro - Informe Oficial de Existencias</h1>
        <p className="text-sm text-neutral-600">
          Emitido el: {new Date().toLocaleDateString('es-ES')} a las {new Date().toLocaleTimeString('es-ES')}
        </p>
      </div>

      {/* Financial Valuation Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <span className="text-xs text-slate-400">Valuación a Precio de Costo (PMP)</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            €{totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400">Capital neto inmovilizado en existencias</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <span className="text-xs text-slate-400">Proyección a Precio de Venta (PVP)</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            €{totalRetail.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400">Valor de realización bruta en mercado</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1">
          <span className="text-xs text-slate-400">Margen Bruto Proyectado</span>
          <div className="text-2xl font-bold font-mono text-indigo-400 tabular-nums">
            +€{potentialGrossProfit.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-400 font-mono">Retorno estimado sobre inventario: +{marginPct}%</p>
        </div>
      </div>

      {/* Two-Column Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Valued Products */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
              Artículos de Mayor Impacto Patrimonial (Top 5)
            </h2>
            <CircleDollarSign className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="space-y-3">
            {topValuedProducts.map((p, idx) => {
              const pctOfTotal = totalCost > 0 ? Math.round((p.totalValue / totalCost) * 100) : 0;

              return (
                <div key={p.id} className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate max-w-[240px]">
                      {idx + 1}. {p.name}
                    </span>
                    <span className="font-mono font-bold text-white tabular-nums">
                      €{p.totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${Math.max(5, pctOfTotal)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>
                      {p.stock} {p.unit} en stock × €{p.costPrice.toFixed(2)}
                    </span>
                    <span>{pctOfTotal}% del valor global</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High Frequency Movement Items */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
              Artículos con Mayor Frecuencia de Movimiento (Kardex)
            </h2>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-3">
            {topActiveProducts.map(([name, count], idx) => {
              const maxCount = topActiveProducts[0]?.[1] || 1;
              const barPct = Math.round((count / maxCount) * 100);

              return (
                <div key={name} className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate max-w-[240px]">
                      {idx + 1}. {name}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {count} operaciones
                    </span>
                  </div>

                  <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${Math.max(8, barPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Health Matrix Summary */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
        <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
          Diagnóstico de Salud de Inventario
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-850 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Disponibilidad Óptima</span>
              <span className="font-mono text-emerald-400 font-bold">
                {products.length > 0
                  ? (
                      ((products.length - (stats.lowStockCount + stats.outOfStockCount)) /
                        products.length) *
                      100
                    ).toFixed(0)
                  : 0}
                %
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {products.length - (stats.lowStockCount + stats.outOfStockCount)} de {products.length} productos sin riesgo de desabastecimiento.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-850 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Artículos en Riesgo Bajo</span>
              <span className="font-mono text-amber-400 font-bold">{stats.lowStockCount} SKUs</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Requieren emisión de orden de compra antes de alcanzar agotamiento total.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-850 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Quiebre de Stock (Agotados)</span>
              <span className="font-mono text-rose-400 font-bold">{stats.outOfStockCount} SKUs</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Artículos sin stock físico disponible para despacho comercial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
