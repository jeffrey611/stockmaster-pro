import React, { useState, useMemo } from 'react';
import {
  History,
  ArrowDownLeft,
  ArrowUpRight,
  SlidersHorizontal,
  ArrowLeftRight,
  Download,
  Plus,
  Search,
  Calendar,
  FileText,
  User,
  Shield,
} from 'lucide-react';
import { Movement, MovementType } from '../types/inventory';
import { exportMovementsToCSV } from '../services/storage';

interface MovementsViewProps {
  movements: Movement[];
  onOpenNewMovement: (type?: MovementType) => void;
}

export const MovementsView: React.FC<MovementsViewProps> = ({ movements, onOpenNewMovement }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | MovementType>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      // Type filter
      if (typeFilter !== 'all' && m.type !== typeFilter) return false;

      // Search filter
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const matchSku = m.sku.toLowerCase().includes(s);
        const matchProd = m.productName.toLowerCase().includes(s);
        const matchDoc = m.referenceDoc.toLowerCase().includes(s);
        const matchReason = m.reason.toLowerCase().includes(s);
        const matchUser = m.userName.toLowerCase().includes(s);
        if (!matchSku && !matchProd && !matchDoc && !matchReason && !matchUser) return false;
      }

      // Date filter
      if (dateFilter !== 'all') {
        const movDate = new Date(m.timestamp);
        const now = new Date();
        if (dateFilter === 'today') {
          if (movDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === 'week') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (movDate < sevenDaysAgo) return false;
        } else if (dateFilter === 'month') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (movDate < thirtyDaysAgo) return false;
        }
      }

      return true;
    });
  }, [movements, typeFilter, searchTerm, dateFilter]);

  // Aggregate metrics
  const totalEntradasUnits = movements
    .filter((m) => m.type === 'entrada')
    .reduce((acc, m) => acc + Math.abs(m.quantity), 0);

  const totalSalidasUnits = movements
    .filter((m) => m.type === 'salida')
    .reduce((acc, m) => acc + Math.abs(m.quantity), 0);

  const totalValuationEntradas = movements
    .filter((m) => m.type === 'entrada')
    .reduce((acc, m) => acc + m.totalCost, 0);

  const totalValuationSalidas = movements
    .filter((m) => m.type === 'salida')
    .reduce((acc, m) => acc + m.totalCost, 0);

  const handleExportCSV = () => {
    exportMovementsToCSV(filteredMovements);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Kardex & Auditoría de Movimientos</h1>
          <p className="text-xs text-slate-400">
            Registro cronológico inmutable de entradas, salidas, ajustes de inventario y transferencias
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar Kardex CSV</span>
          </button>

          <button
            onClick={() => onOpenNewMovement('entrada')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Registrar Movimiento</span>
          </button>
        </div>
      </div>

      {/* Kardex Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Entradas Acumuladas</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            +{totalEntradasUnits} uds
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Valoración: €{totalValuationEntradas.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Salidas / Despachos</span>
            <ArrowUpRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400 tabular-nums">
            -{totalSalidasUnits} uds
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Valoración: €{totalValuationSalidas.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Ajustes & Mermas</span>
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
            {movements.filter((m) => m.type === 'ajuste').length} actas
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Auditoría física de almacén</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Movimientos</span>
            <History className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            {movements.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Registros trazables en sistema</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por Doc, Producto, SKU o Usuario..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Type filters (Segmented buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-850 overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                typeFilter === 'all'
                  ? 'bg-slate-800 text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({movements.length})
            </button>
            <button
              onClick={() => setTypeFilter('entrada')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                typeFilter === 'entrada'
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Entradas
            </button>
            <button
              onClick={() => setTypeFilter('salida')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                typeFilter === 'salida'
                  ? 'bg-slate-800 text-rose-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Salidas
            </button>
            <button
              onClick={() => setTypeFilter('ajuste')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                typeFilter === 'ajuste'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ajustes
            </button>
            <button
              onClick={() => setTypeFilter('transferencia')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                typeFilter === 'transferencia'
                  ? 'bg-slate-800 text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Traslados
            </button>
          </div>
        </div>
      </div>

      {/* Kardex Ledger Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        {filteredMovements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha & Hora</th>
                  <th className="px-3 py-3 font-medium text-center">Tipo</th>
                  <th className="px-3 py-3 font-medium">Documento Ref</th>
                  <th className="px-4 py-3 font-medium">Producto / SKU</th>
                  <th className="px-3 py-3 font-medium text-center">Cantidad</th>
                  <th className="px-3 py-3 font-medium text-center">Variación Stock</th>
                  <th className="px-3 py-3 font-medium text-right">Valor Operación</th>
                  <th className="px-4 py-3 font-medium">Motivo / Justificación</th>
                  <th className="px-4 py-3 font-medium text-right">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMovements.map((m) => {
                  const isEntrada = m.type === 'entrada';
                  const isSalida = m.type === 'salida';
                  const isAjuste = m.type === 'ajuste';

                  return (
                    <tr key={m.id} className="hover:bg-slate-850/50 transition-colors">
                      {/* Date & Time */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-mono text-slate-200">
                          {new Date(m.timestamp).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {new Date(m.timestamp).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Type (Clean typography, no static candy pills) */}
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <span
                          className={`font-semibold text-[11px] ${
                            isEntrada
                              ? 'text-emerald-400'
                              : isSalida
                              ? 'text-rose-400'
                              : isAjuste
                              ? 'text-amber-400'
                              : 'text-indigo-400'
                          }`}
                        >
                          {m.type.toUpperCase()}
                        </span>
                      </td>

                      {/* Doc Reference */}
                      <td className="px-3 py-3 whitespace-nowrap font-mono font-bold text-slate-200">
                        {m.referenceDoc}
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-100 max-w-xs truncate">{m.productName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{m.sku}</div>
                      </td>

                      {/* Quantity */}
                      <td className="px-3 py-3 text-center font-mono font-bold tabular-nums">
                        <span
                          className={
                            isEntrada
                              ? 'text-emerald-400'
                              : isSalida
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }
                        >
                          {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                        </span>
                      </td>

                      {/* Stock Change (Prev -> New) */}
                      <td className="px-3 py-3 text-center font-mono text-[11px] text-slate-400 tabular-nums">
                        {m.previousStock} → <span className="text-slate-200 font-semibold">{m.newStock}</span>
                      </td>

                      {/* Total Cost Impact */}
                      <td className="px-3 py-3 text-right font-mono text-slate-200 tabular-nums">
                        €{m.totalCost.toFixed(2)}
                      </td>

                      {/* Reason */}
                      <td className="px-4 py-3 text-slate-300 max-w-xs truncate text-[11px]" title={m.reason}>
                        {m.reason}
                      </td>

                      {/* Responsible User */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="font-medium text-slate-200">{m.userName}</div>
                        <div className="text-[10px] text-indigo-400 font-mono capitalize">{m.userRole}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <History className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="font-medium text-slate-300">No se encontraron movimientos</p>
            <p className="text-[11px] text-slate-400">
              No hay registros que coincidan con los criterios de búsqueda o fecha seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
