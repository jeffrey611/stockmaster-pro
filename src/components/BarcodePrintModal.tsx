import React from 'react';
import { X, Printer, Barcode as BarcodeIcon } from 'lucide-react';
import { Product } from '../types/inventory';

interface BarcodePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const BarcodePrintModal: React.FC<BarcodePrintModalProps> = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate stylized barcode bars matching the barcode string
  const renderBarcodeBars = (code: string) => {
    const bars: { width: number; isBlack: boolean }[] = [];
    for (let i = 0; i < code.length; i++) {
      const digit = parseInt(code[i], 10) || 1;
      bars.push({ width: (digit % 3) + 1, isBlack: i % 2 === 0 });
      bars.push({ width: ((digit * 2) % 3) + 1, isBlack: false });
      bars.push({ width: ((digit + 1) % 4) + 1, isBlack: true });
    }
    return bars;
  };

  const barcodeBars = renderBarcodeBars(product.barcode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header (No print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Imprimir Etiqueta de Identificación</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Label View */}
        <div className="p-6 flex flex-col items-center">
          <p className="text-xs text-slate-400 mb-4 text-center no-print">
            Vista previa del rótulo adhesivo térmico estándar (100mm x 50mm):
          </p>

          {/* Thermal sticker preview */}
          <div className="w-full max-w-sm bg-white text-black p-5 rounded-lg border-2 border-dashed border-slate-400 shadow-md">
            <div className="border-b border-black pb-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest uppercase">StockMaster Logistics</span>
                <span className="text-[10px] font-mono font-bold bg-black text-white px-1.5 py-0.5 rounded">
                  {product.brand}
                </span>
              </div>
              <h3 className="text-sm font-bold text-black mt-1 leading-snug truncate">{product.name}</h3>
            </div>

            {/* Visual Barcode representation */}
            <div className="flex flex-col items-center justify-center py-2 bg-slate-50 border border-slate-200 rounded p-3">
              <div className="flex items-end h-16 w-full max-w-[260px] justify-between px-2">
                {barcodeBars.slice(0, 38).map((bar, idx) => (
                  <div
                    key={idx}
                    className={`h-full ${bar.isBlack ? 'bg-black' : 'bg-transparent'}`}
                    style={{ width: `${bar.width * 2}px` }}
                  />
                ))}
              </div>
              <span className="text-xs font-mono font-bold tracking-widest mt-1 text-black">
                {product.barcode}
              </span>
            </div>

            {/* Label metadata */}
            <div className="mt-3 pt-2 border-t border-black grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="block text-[9px] text-neutral-600 uppercase font-semibold">Código SKU</span>
                <span className="font-mono font-bold">{product.sku}</span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] text-neutral-600 uppercase font-semibold">Ubicación</span>
                <span className="font-bold truncate block">{product.aisleRack}</span>
              </div>
              <div>
                <span className="block text-[9px] text-neutral-600 uppercase font-semibold">Categoría</span>
                <span>{product.category}</span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] text-neutral-600 uppercase font-semibold">PVP Ref</span>
                <span className="font-mono font-bold">€{product.sellingPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions (No print) */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Mandar a Imprimir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
