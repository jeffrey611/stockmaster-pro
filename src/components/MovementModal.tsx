import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, SlidersHorizontal, ArrowLeftRight, Check, AlertCircle } from 'lucide-react';
import { Product, MovementType, Warehouse, User } from '../types/inventory';

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  warehouses: Warehouse[];
  currentUser: User | null;
  defaultType?: MovementType;
  selectedProduct?: Product | null;
  onRecordMovement: (movementData: {
    productId: string;
    productName: string;
    sku: string;
    type: MovementType;
    quantity: number;
    unitCost: number;
    referenceDoc: string;
    reason: string;
    sourceWarehouseId?: string;
    targetWarehouseId?: string;
    userId: string;
    userName: string;
    userRole: any;
  }) => void;
}

export const MovementModal: React.FC<MovementModalProps> = ({
  isOpen,
  onClose,
  products,
  warehouses,
  currentUser,
  defaultType = 'entrada',
  selectedProduct = null,
  onRecordMovement,
}) => {
  const [type, setType] = useState<MovementType>(defaultType);
  const [selectedProdId, setSelectedProdId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [referenceDoc, setReferenceDoc] = useState('');
  const [reason, setReason] = useState('');
  const [targetWarehouseId, setTargetWarehouseId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setType(defaultType);
    if (selectedProduct) {
      setSelectedProdId(selectedProduct.id);
    } else if (products.length > 0 && !selectedProdId) {
      setSelectedProdId(products[0].id);
    }
    setQuantity(1);
    setReferenceDoc('');
    setReason('');
    setErrorMsg('');
    if (warehouses.length > 1) {
      setTargetWarehouseId(warehouses[1].id);
    }
  }, [isOpen, defaultType, selectedProduct, products, warehouses]);

  if (!isOpen) return null;

  const currentProd = products.find((p) => p.id === selectedProdId) || products[0];

  const calculateNewStock = (): number => {
    if (!currentProd) return 0;
    const current = currentProd.stock;
    const qty = Math.abs(quantity);

    if (type === 'entrada') return current + qty;
    if (type === 'salida') return Math.max(0, current - qty);
    if (type === 'ajuste') return current + quantity; // can be negative
    if (type === 'transferencia') return current;
    return current;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentProd) {
      setErrorMsg('Selecciona un producto');
      return;
    }

    if (quantity === 0) {
      setErrorMsg('La cantidad no puede ser cero');
      return;
    }

    if (type === 'salida' && Math.abs(quantity) > currentProd.stock) {
      setErrorMsg(`Stock insuficiente. Disponible: ${currentProd.stock}, intentas retirar: ${Math.abs(quantity)}`);
      return;
    }

    if (type === 'ajuste' && currentProd.stock + quantity < 0) {
      setErrorMsg('El ajuste no puede dejar el stock total por debajo de 0');
      return;
    }

    if (!referenceDoc.trim()) {
      setErrorMsg('Ingresa un documento de referencia (ej: FAC-01, ORDEN-99, ACTA-04)');
      return;
    }

    if (!reason.trim()) {
      setErrorMsg('Ingresa el motivo del movimiento para fines de auditoría');
      return;
    }

    const finalQty = type === 'salida' ? -Math.abs(quantity) : type === 'ajuste' ? quantity : Math.abs(quantity);

    onRecordMovement({
      productId: currentProd.id,
      productName: currentProd.name,
      sku: currentProd.sku,
      type,
      quantity: finalQty,
      unitCost: currentProd.costPrice,
      referenceDoc: referenceDoc.trim(),
      reason: reason.trim(),
      sourceWarehouseId: currentProd.warehouseId,
      targetWarehouseId: type === 'transferencia' ? targetWarehouseId : undefined,
      userId: currentUser?.id || 'usr_anon',
      userName: currentUser?.name || 'Operador',
      userRole: currentUser?.role || 'almacenero',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">Registrar Movimiento de Almacén</h2>
            <p className="text-xs text-slate-400">Actualización en tiempo real de Kardex y existencias</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selector (Segmented control) */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800/80">
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setType('entrada')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-lg border transition-colors ${
                type === 'entrada'
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Entrada</span>
            </button>

            <button
              type="button"
              onClick={() => setType('salida')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-lg border transition-colors ${
                type === 'salida'
                  ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Salida</span>
            </button>

            <button
              type="button"
              onClick={() => setType('ajuste')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-lg border transition-colors ${
                type === 'ajuste'
                  ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Ajuste</span>
            </button>

            <button
              type="button"
              onClick={() => setType('transferencia')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-lg border transition-colors ${
                type === 'transferencia'
                  ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Traslado</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-md text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Product selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Producto</label>
            <select
              value={selectedProdId}
              onChange={(e) => setSelectedProdId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.sku}] {p.name} (Stock: {p.stock} {p.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Live stock forecast card */}
          {currentProd && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400">Stock Actual:</span>
                <span className="font-mono font-semibold text-slate-200">
                  {currentProd.stock} {currentProd.unit}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400">Variación por {type}:</span>
                <span
                  className={`font-mono font-semibold ${
                    type === 'entrada'
                      ? 'text-emerald-400'
                      : type === 'salida'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {type === 'salida' ? `-${Math.abs(quantity)}` : type === 'entrada' ? `+${Math.abs(quantity)}` : quantity > 0 ? `+${quantity}` : quantity} {currentProd.unit}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs font-medium">
                <span className="text-slate-300">Stock Resultante:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {calculateNewStock()} {currentProd.unit}
                </span>
              </div>
            </div>
          )}

          {/* Quantity & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {type === 'ajuste' ? 'Cantidad de Ajuste (+ / -)' : 'Cantidad'}
              </label>
              <input
                type="number"
                min={type === 'ajuste' ? -1000 : 1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Documento de Referencia <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={referenceDoc}
                onChange={(e) => setReferenceDoc(e.target.value)}
                placeholder="ej: FAC-2024-8192 o REMITO-501"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Transfer warehouse target if transfer */}
          {type === 'transferencia' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Almacén Destino</label>
              <select
                value={targetWarehouseId}
                onChange={(e) => setTargetWarehouseId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {warehouses
                  .filter((w) => w.id !== currentProd?.warehouseId)
                  .map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.code})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Reason / Auditor note */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Motivo o Justificación del Movimiento <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="ej: Recepción de pedido de proveedor / Despacho a cliente corporativo / Ajuste físico por rotura"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer actions */}
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
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white rounded-lg transition-colors shadow-sm ${
                type === 'entrada'
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : type === 'salida'
                  ? 'bg-rose-600 hover:bg-rose-500'
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirmar Registro</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
