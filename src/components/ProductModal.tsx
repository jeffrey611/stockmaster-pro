import React, { useState, useEffect } from 'react';
import { X, Sparkles, Barcode as BarcodeIcon, AlertCircle, Save } from 'lucide-react';
import { Product, Supplier, Warehouse, Category } from '../types/inventory';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialProduct?: Product | null;
  suppliers: Supplier[];
  warehouses: Warehouse[];
  categories: Category[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
  suppliers,
  warehouses,
  categories,
}) => {
  const isEditing = Boolean(initialProduct);

  const [formData, setFormData] = useState<Partial<Product>>({
    sku: '',
    barcode: '',
    name: '',
    description: '',
    category: categories[0]?.name || 'Hardware & Equipamiento',
    brand: '',
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStock: 5,
    maxStock: 50,
    unit: 'unidades',
    warehouseId: warehouses[0]?.id || 'wh_central',
    aisleRack: 'Pasillo A - Estante 01',
    supplierId: suppliers[0]?.id || 'sup_synnex',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialProduct) {
      setFormData(initialProduct);
    } else {
      // New product defaults
      const randomBarcode = `77900${Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8)}`;
      setFormData({
        sku: 'ART-' + Math.floor(1000 + Math.random() * 9000),
        barcode: randomBarcode,
        name: '',
        description: '',
        category: categories[0]?.name || 'Hardware & Equipamiento',
        brand: '',
        costPrice: 0,
        sellingPrice: 0,
        stock: 10,
        minStock: 5,
        maxStock: 50,
        unit: 'unidades',
        warehouseId: warehouses[0]?.id || 'wh_central',
        aisleRack: 'Pasillo A - Nivel 1',
        supplierId: suppliers[0]?.id || '',
      });
    }
    setErrors({});
  }, [initialProduct, isOpen, categories, warehouses, suppliers]);

  if (!isOpen) return null;

  const generateAutoSKU = () => {
    const brandPrefix = (formData.brand || 'GEN').substring(0, 3).toUpperCase();
    const namePrefix = (formData.name || 'PRD').replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setFormData((prev) => ({
      ...prev,
      sku: `${brandPrefix}-${namePrefix}-${randomSuffix}`,
    }));
  };

  const generateAutoBarcode = () => {
    const code = `77900${Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8)}`;
    setFormData((prev) => ({ ...prev, barcode: code }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.sku?.trim()) newErrors.sku = 'El SKU es obligatorio';
    if (!formData.barcode?.trim()) newErrors.barcode = 'El código de barras es obligatorio';
    if ((formData.costPrice ?? 0) < 0) newErrors.costPrice = 'El costo no puede ser negativo';
    if ((formData.sellingPrice ?? 0) < 0) newErrors.sellingPrice = 'El precio no puede ser negativo';
    if ((formData.stock ?? 0) < 0) newErrors.stock = 'El stock no puede ser negativo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalProduct: Product = {
      id: initialProduct?.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sku: formData.sku!.trim(),
      barcode: formData.barcode!.trim(),
      name: formData.name!.trim(),
      description: formData.description || '',
      category: formData.category || categories[0]?.name || 'General',
      brand: formData.brand?.trim() || 'Genérico',
      costPrice: Number(formData.costPrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      stock: Number(formData.stock) || 0,
      minStock: Number(formData.minStock) || 0,
      maxStock: Number(formData.maxStock) || 100,
      unit: formData.unit || 'unidades',
      warehouseId: formData.warehouseId || warehouses[0]?.id || 'wh_central',
      aisleRack: formData.aisleRack?.trim() || 'General',
      supplierId: formData.supplierId || (suppliers[0]?.id ?? ''),
      createdAt: initialProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(finalProduct);
    onClose();
  };

  const marginPct =
    formData.costPrice && formData.sellingPrice && formData.costPrice > 0
      ? (((formData.sellingPrice - formData.costPrice) / formData.costPrice) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">
              {isEditing ? 'Editar Producto en Inventario' : 'Registrar Nuevo Producto'}
            </h2>
            <p className="text-xs text-slate-400">
              {isEditing ? `Modificando SKU: ${initialProduct?.sku}` : 'Ingresa los datos para dar de alta en el catálogo'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Row 1: Name and Brand */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nombre del Producto <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ej: Monitor Curvo Gaming 34 pulgadas"
                className={`w-full px-3 py-2 text-xs bg-slate-950 border rounded-lg text-slate-200 focus:outline-none ${
                  errors.name ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.name && <p className="text-[10px] text-rose-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Marca / Fabricante</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="ej: Samsung, Dell, Cisco"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 2: SKU and Barcode with auto-generators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Código SKU <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateAutoSKU}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Autogenerar</span>
                </button>
              </div>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="ej: MON-SAMS-34C"
                className={`w-full px-3 py-2 text-xs font-mono bg-slate-950 border rounded-lg text-slate-200 focus:outline-none ${
                  errors.sku ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Código de Barras (EAN / UPC) <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateAutoBarcode}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <BarcodeIcon className="w-3 h-3" />
                  <span>Generar Código</span>
                </button>
              </div>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="ej: 7790010023415"
                className={`w-full px-3 py-2 text-xs font-mono bg-slate-950 border rounded-lg text-slate-200 focus:outline-none ${
                  errors.barcode ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
            </div>
          </div>

          {/* Row 3: Category, Unit and Supplier */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Unidad de Medida</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="unidades">Unidades (Pzas)</option>
                <option value="cajas">Cajas</option>
                <option value="paquetes">Paquetes</option>
                <option value="kg">Kilogramos (kg)</option>
                <option value="metros">Metros (m)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Proveedor Habitual</label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Sin proveedor --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Pricing & Margin */}
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Precio Costo (€/$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-750 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Precio Venta (€/$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-750 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-400 mb-1">Margen Comercial Bruto</span>
                <div className="px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Margen:</span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      Number(marginPct) > 20
                        ? 'text-emerald-400'
                        : Number(marginPct) > 0
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    +{marginPct}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Stock Levels and Alert Thresholds */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Stock Actual</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Stock Mínimo (Alerta)
              </label>
              <input
                type="number"
                min="1"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Stock Máximo</label>
              <input
                type="number"
                min="1"
                value={formData.maxStock}
                onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 6: Warehouse and Physical Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Almacén Destino</label>
              <select
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ubicación Física (Pasillo / Estantería / Casillero)
              </label>
              <input
                type="text"
                value={formData.aisleRack}
                onChange={(e) => setFormData({ ...formData, aisleRack: e.target.value })}
                placeholder="ej: Pasillo B - Estante 03 - Casillero 2"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Descripción Técnica / Notas</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Especificaciones, compatibilidad o notas para el equipo de almacén..."
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Guardar Cambios' : 'Registrar Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
