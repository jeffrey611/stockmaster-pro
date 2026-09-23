import React, { useState } from 'react';
import { Warehouse as WarehouseIcon, MapPin, User, Package, Plus, X, Save, Edit3 } from 'lucide-react';
import { Warehouse, Product } from '../types/inventory';

interface WarehousesViewProps {
  warehouses: Warehouse[];
  products: Product[];
  onSaveWarehouse: (wh: Warehouse) => void;
}

export const WarehousesView: React.FC<WarehousesViewProps> = ({ warehouses, products, onSaveWarehouse }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWh, setEditingWh] = useState<Warehouse | null>(null);

  const [formData, setFormData] = useState<Partial<Warehouse>>({
    name: '',
    code: '',
    address: '',
    capacityUnits: 15000,
    managerName: '',
    isDefault: false,
  });

  const handleOpenCreate = () => {
    setEditingWh(null);
    setFormData({
      name: '',
      code: `ALM-0${warehouses.length + 1}`,
      address: '',
      capacityUnits: 10000,
      managerName: '',
      isDefault: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (wh: Warehouse) => {
    setEditingWh(wh);
    setFormData(wh);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.code?.trim()) return;

    const finalWh: Warehouse = {
      id: editingWh?.id || `wh_${Date.now()}`,
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      address: formData.address?.trim() || 'Dirección de Almacén',
      capacityUnits: Number(formData.capacityUnits) || 10000,
      managerName: formData.managerName?.trim() || 'Jefe de Operaciones',
      isDefault: Boolean(formData.isDefault),
    };

    onSaveWarehouse(finalWh);
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Centros de Almacenamiento & Depósitos</h1>
          <p className="text-xs text-slate-400">
            Control de ocupación, distribución espacial y zonificación de existencias
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Nuevo Almacén</span>
        </button>
      </div>

      {/* Warehouse Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {warehouses.map((wh) => {
          const whProducts = products.filter((p) => p.warehouseId === wh.id);
          const totalUnits = whProducts.reduce((sum, p) => sum + p.stock, 0);
          const totalValuation = whProducts.reduce((sum, p) => sum + p.stock * p.costPrice, 0);
          const occupancyPct = Math.min(100, Math.round((totalUnits / wh.capacityUnits) * 100));

          return (
            <div
              key={wh.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                      <WarehouseIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{wh.name}</h3>
                      <span className="text-[10px] font-mono text-indigo-400 font-semibold">{wh.code}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(wh)}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 rounded"
                    title="Editar datos de almacén"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{wh.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Responsable: {wh.managerName}</span>
                  </div>
                </div>

                {/* Occupancy bar */}
                <div className="mt-4 pt-3 border-t border-slate-850 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Nivel de Ocupación:</span>
                    <span className="font-mono font-bold text-white">{occupancyPct}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        occupancyPct > 85 ? 'bg-rose-500' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(5, occupancyPct)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{totalUnits.toLocaleString('es-ES')} unidades</span>
                    <span>Capacidad: {wh.capacityUnits.toLocaleString('es-ES')}</span>
                  </div>
                </div>
              </div>

              {/* Warehouse Inventory Footprint */}
              <div className="pt-3 border-t border-slate-850 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">SKUs Asignados</span>
                  <span className="font-mono font-bold text-white">{whProducts.length} productos</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Valor en Custodia</span>
                  <span className="font-mono font-bold text-indigo-400">
                    €{totalValuation.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warehouse Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">
                {editingWh ? 'Editar Almacén' : 'Crear Centro de Almacenamiento'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre del Centro Logístico</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: Almacén Satélite Poniente"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Código Identificador</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="ej: ALM-04-PON"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Capacidad Máxima (Uds)</label>
                  <input
                    type="number"
                    min="100"
                    value={formData.capacityUnits}
                    onChange={(e) => setFormData({ ...formData, capacityUnits: parseInt(e.target.value, 10) || 5000 })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Responsable / Encargado</label>
                <input
                  type="text"
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                  placeholder="ej: Rodrigo Hernández"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Dirección Física</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="ej: Carretera de Circunvalación km 12, Nave 5"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Almacén</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
