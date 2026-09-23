import React, { useState } from 'react';
import { X, Barcode, Search, CheckCircle2, ArrowDownLeft, ArrowUpRight, Package, AlertTriangle } from 'lucide-react';
import { Product } from '../types/inventory';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onQuickStockChange: (productId: string, delta: number, reason: string) => void;
  onOpenMovement: (product: Product, type: 'entrada' | 'salida') => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  products,
  onQuickStockChange,
  onOpenMovement,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [scanSuccessFeedback, setScanSuccessFeedback] = useState(false);

  if (!isOpen) return null;

  const handleLookup = (code: string) => {
    const cleanCode = code.trim().toLowerCase();
    if (!cleanCode) {
      setMatchedProduct(null);
      return;
    }

    const found = products.find(
      (p) =>
        p.barcode.toLowerCase() === cleanCode ||
        p.sku.toLowerCase() === cleanCode ||
        p.name.toLowerCase().includes(cleanCode)
    );

    if (found) {
      setMatchedProduct(found);
      setLastScannedCode(found.barcode);
      setScanSuccessFeedback(true);
      setTimeout(() => setScanSuccessFeedback(false), 1200);
    } else {
      setMatchedProduct(null);
    }
  };

  const handleSimulateScan = (prod: Product) => {
    setSearchInput(prod.barcode);
    handleLookup(prod.barcode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Barcode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Escáner de Código de Barras / SKU</h2>
              <p className="text-xs text-slate-400">Identificación óptica y control rápido de existencias</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Simulated Optical Viewfinder */}
          <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
            {/* Corner guides */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-indigo-500"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-indigo-500"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-indigo-500"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-indigo-500"></div>

            {/* Red laser scanning animation line */}
            <div className="absolute w-3/4 h-0.5 bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse"></div>

            {/* Viewfinder text */}
            <div className="z-10 text-center px-4">
              <Barcode className="w-12 h-12 text-slate-700 mx-auto mb-1 stroke-1" />
              <p className="text-xs font-mono text-slate-400">
                {scanSuccessFeedback ? '¡CÓDIGO IDENTIFICADO CON ÉXITO!' : 'APUNTE EL LECTOR ÓPTICO O INGRESE EL CÓDIGO'}
              </p>
              {lastScannedCode && (
                <p className="text-[11px] font-mono text-indigo-400 mt-1">EAN: {lastScannedCode}</p>
              )}
            </div>
          </div>

          {/* Manual Input / Barcode Gun Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Entrada de Lector de Pistola o Búsqueda Manual
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    handleLookup(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLookup(searchInput);
                  }}
                  placeholder="Escanee con pistola USB o escriba código / SKU (ej: 7790010023415 o LAP-THINK-T14)"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleLookup(searchInput)}
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Matched Product Panel */}
          {matchedProduct ? (
            <div className="p-4 bg-slate-950/80 border border-indigo-500/40 rounded-xl space-y-3 animate-in fade-in duration-100">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-indigo-400">
                      SKU: {matchedProduct.sku}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs font-mono text-slate-400">EAN: {matchedProduct.barcode}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-1">{matchedProduct.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {matchedProduct.category} · {matchedProduct.brand} · Ubicación: {matchedProduct.aisleRack}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Existencias actuales</div>
                  <div
                    className={`text-lg font-mono font-bold ${
                      matchedProduct.stock <= 0
                        ? 'text-rose-400'
                        : matchedProduct.stock <= matchedProduct.minStock
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {matchedProduct.stock} {matchedProduct.unit}
                  </div>
                </div>
              </div>

              {/* Quick Actions upon Scan */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-400">Acciones rápidas sobre el producto:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onQuickStockChange(matchedProduct.id, 1, 'Ingreso rápido verificado por escáner');
                      setMatchedProduct({ ...matchedProduct, stock: matchedProduct.stock + 1 });
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/50 rounded-lg transition-colors"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>+1 Entrada</span>
                  </button>

                  <button
                    type="button"
                    disabled={matchedProduct.stock <= 0}
                    onClick={() => {
                      if (matchedProduct.stock > 0) {
                        onQuickStockChange(matchedProduct.id, -1, 'Despacho rápido verificado por escáner');
                        setMatchedProduct({ ...matchedProduct, stock: matchedProduct.stock - 1 });
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-400 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-700/50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>-1 Salida</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenMovement(matchedProduct, 'entrada');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors"
                  >
                    Kardex Completo
                  </button>
                </div>
              </div>
            </div>
          ) : searchInput ? (
            <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-lg text-center text-xs text-slate-400">
              No se encontró ningún artículo con el código "<span className="text-white font-mono">{searchInput}</span>".
            </div>
          ) : null}

          {/* Quick Click Simulators for Recruiter / Reviewer Testing */}
          <div className="pt-2">
            <p className="text-xs font-medium text-slate-400 mb-2">
              Pruebas Rápidas de Código (Haz clic para simular escaneo inmediato):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {products.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSimulateScan(p)}
                  className="text-left p-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-850 hover:border-slate-700 transition-colors flex items-center justify-between"
                >
                  <div className="truncate mr-2">
                    <p className="text-xs font-medium text-slate-200 truncate">{p.name}</p>
                    <p className="text-[10px] font-mono text-slate-400">EAN: {p.barcode}</p>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-indigo-400">
                    Escanear
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
