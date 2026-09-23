import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  Upload,
  Printer,
  Edit3,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Barcode,
  Package,
  AlertTriangle,
  Boxes,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { Product, Warehouse, Category, Supplier } from '../types/inventory';
import { exportProductsToCSV, parseCSVProducts } from '../services/storage';

interface ProductsViewProps {
  products: Product[];
  warehouses: Warehouse[];
  categories: Category[];
  suppliers: Supplier[];
  onOpenNewProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenMovement: (product: Product, type: 'entrada' | 'salida') => void;
  onPrintBarcode: (product: Product) => void;
  onImportProducts: (newProducts: Product[]) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  warehouses,
  categories,
  suppliers,
  onOpenNewProduct,
  onEditProduct,
  onDeleteProduct,
  onOpenMovement,
  onPrintBarcode,
  onImportProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'sku'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // CSV Import State
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search term
        if (searchTerm) {
          const s = searchTerm.toLowerCase();
          const matchSku = p.sku.toLowerCase().includes(s);
          const matchName = p.name.toLowerCase().includes(s);
          const matchBarcode = p.barcode.toLowerCase().includes(s);
          const matchBrand = p.brand.toLowerCase().includes(s);
          if (!matchSku && !matchName && !matchBarcode && !matchBrand) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Warehouse filter
        if (selectedWarehouse !== 'all' && p.warehouseId !== selectedWarehouse) {
          return false;
        }

        // Stock status filter
        if (stockStatusFilter === 'in_stock' && p.stock <= p.minStock) {
          return false;
        }
        if (stockStatusFilter === 'low_stock' && (p.stock > p.minStock || p.stock === 0)) {
          return false;
        }
        if (stockStatusFilter === 'out_of_stock' && p.stock > 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'name') comp = a.name.localeCompare(b.name);
        else if (sortBy === 'sku') comp = a.sku.localeCompare(b.sku);
        else if (sortBy === 'stock') comp = a.stock - b.stock;
        else if (sortBy === 'price') comp = a.sellingPrice - b.sellingPrice;
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [products, searchTerm, selectedCategory, selectedWarehouse, stockStatusFilter, sortBy, sortOrder]);

  const handleExportCSV = () => {
    exportProductsToCSV(filteredProducts);
  };

  const handleProcessImport = () => {
    setImportErrors([]);
    setImportSuccessCount(null);
    if (!csvContent.trim()) {
      setImportErrors(['Por favor pega o carga el contenido del archivo CSV']);
      return;
    }

    const { products: imported, errors } = parseCSVProducts(csvContent);
    if (errors.length > 0) {
      setImportErrors(errors);
    }
    if (imported.length > 0) {
      onImportProducts(imported);
      setImportSuccessCount(imported.length);
      setTimeout(() => {
        setImportModalOpen(false);
        setCsvContent('');
        setImportSuccessCount(null);
      }, 1200);
    }
  };

  const handleLoadSampleCSV = () => {
    const sample = `SKU,CodigoBarras,Nombre,Categoria,Marca,PrecioCosto,PrecioVenta,StockActual,StockMinimo,StockMaximo,Unidad,Ubicacion
ACC-HUB-7IN1,7790088991122,Hub USB-C 7 en 1 Multipuerto 4K HDMI,Periféricos & Accesorios,Anker,32.00,54.90,25,8,60,unidades,Pasillo B - Estante 02
ROU-WIFI6-AX3000,7790088991139,Router Gigabit WiFi 6 AX3000 Doble Banda,Infraestructura & Redes,TP-Link,45.50,79.00,12,5,30,unidades,Pasillo A - Estante 05`;
    setCsvContent(sample);
  };

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Catálogo de Inventario</h1>
          <p className="text-xs text-slate-400">
            {filteredProducts.length} de {products.length} productos registrados · Control de existencias físicas
          </p>
        </div>

        {/* Primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors"
            title="Descargar listado actual en formato CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors"
            title="Importar catálogo masivo vía archivo CSV"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Importar CSV</span>
          </button>

          <button
            onClick={onOpenNewProduct}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por SKU, Nombre, Código de Barras o Marca..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Todas las Categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Warehouse filter */}
          <div>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Todos los Almacenes</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock status filter tabs (Segmented controls, Zero-pill compliant) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-850">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-850">
            <button
              onClick={() => setStockStatusFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                stockStatusFilter === 'all'
                  ? 'bg-slate-800 text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({products.length})
            </button>
            <button
              onClick={() => setStockStatusFilter('in_stock')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                stockStatusFilter === 'in_stock'
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stock Óptimo ({products.filter((p) => p.stock > p.minStock).length})
            </button>
            <button
              onClick={() => setStockStatusFilter('low_stock')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                stockStatusFilter === 'low_stock'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stock Bajo ({products.filter((p) => p.stock <= p.minStock && p.stock > 0).length})
            </button>
            <button
              onClick={() => setStockStatusFilter('out_of_stock')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                stockStatusFilter === 'out_of_stock'
                  ? 'bg-slate-800 text-rose-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Agotados ({products.filter((p) => p.stock === 0).length})
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-md text-slate-300 focus:outline-none"
            >
              <option value="name">Nombre</option>
              <option value="stock">Existencias (Stock)</option>
              <option value="price">Precio Venta</option>
              <option value="sku">SKU</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-md"
              title="Cambiar orden ascendente/descendente"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Products Table (High-density, tabular figures, no static candy pills) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="px-4 py-3 font-medium">SKU / Identificador</th>
                  <th className="px-4 py-3 font-medium">Artículo & Categoría</th>
                  <th className="px-3 py-3 font-medium text-right">Costo / PVP</th>
                  <th className="px-4 py-3 font-medium text-center">Existencias</th>
                  <th className="px-3 py-3 font-medium text-center">Mín / Máx</th>
                  <th className="px-4 py-3 font-medium">Ubicación Física</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => {
                  const isZero = p.stock === 0;
                  const isLow = p.stock <= p.minStock && p.stock > 0;
                  const whName = warehouses.find((w) => w.id === p.warehouseId)?.code || 'ALM-01';

                  return (
                    <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                      {/* SKU and Barcode */}
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-white text-xs tracking-tight">{p.sku}</div>
                        <div className="font-mono text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Barcode className="w-3 h-3 text-slate-400" />
                          <span>{p.barcode}</span>
                        </div>
                      </td>

                      {/* Name, Brand and Category (Zero-pill text separators) */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-100 max-w-xs truncate" title={p.name}>
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <span className="text-slate-300">{p.brand}</span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-slate-400">{p.category}</span>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="px-3 py-3 text-right">
                        <div className="font-mono font-bold text-white tabular-nums text-xs">
                          €{p.sellingPrice.toFixed(2)}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 tabular-nums">
                          Costo: €{p.costPrice.toFixed(2)}
                        </div>
                      </td>

                      {/* Stock with semantic status typography */}
                      <td className="px-4 py-3 text-center">
                        <div
                          className={`font-mono font-bold text-sm tabular-nums ${
                            isZero ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {p.stock}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isZero ? 'Agotado' : isLow ? 'Stock Bajo' : 'Disponible'} · {p.unit}
                        </div>
                      </td>

                      {/* Min / Max */}
                      <td className="px-3 py-3 text-center font-mono text-[11px] text-slate-400 tabular-nums">
                        {p.minStock} / {p.maxStock}
                      </td>

                      {/* Warehouse Location */}
                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-200 truncate max-w-[160px]">{p.aisleRack}</div>
                        <div className="text-[10px] font-mono text-slate-400">{whName}</div>
                      </td>

                      {/* Row Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick Entrada */}
                          <button
                            onClick={() => onOpenMovement(p, 'entrada')}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
                            title="Registrar Entrada rápida de existencias"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Salida */}
                          <button
                            onClick={() => onOpenMovement(p, 'salida')}
                            disabled={isZero}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Registrar Salida de existencias"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          {/* Print Barcode Label */}
                          <button
                            onClick={() => onPrintBarcode(p)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                            title="Imprimir Rótulo con Código de Barras"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Product */}
                          <button
                            onClick={() => onEditProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                            title="Editar ficha del producto"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Product */}
                          <button
                            onClick={() => {
                              if (confirm(`¿Estás seguro de eliminar el producto "${p.name}" (SKU: ${p.sku})?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                            title="Dar de baja producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 space-y-3">
            <Package className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-medium text-slate-300">No se encontraron artículos</p>
            <p className="max-w-md mx-auto text-slate-400 text-xs">
              No hay productos que coincidan con los filtros seleccionados o el catálogo está vacío.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedWarehouse('all');
                  setStockStatusFilter('all');
                }}
                className="px-3 py-1.5 text-xs text-indigo-400 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
              >
                Limpiar Filtros
              </button>
              <button
                onClick={onOpenNewProduct}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                + Crear Primer Artículo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-semibold text-white">Importación Masiva de Productos (CSV)</h3>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-300">
                Pega el contenido de tu hoja de cálculo CSV o carga datos de prueba.
              </p>

              {importErrors.length > 0 && (
                <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 space-y-1">
                  {importErrors.map((err, i) => (
                    <div key={i}>• {err}</div>
                  ))}
                </div>
              )}

              {importSuccessCount !== null && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>¡{importSuccessCount} productos importados correctamente!</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Texto CSV con cabeceras:</span>
                <button
                  type="button"
                  onClick={handleLoadSampleCSV}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                >
                  Cargar ejemplo de prueba
                </button>
              </div>

              <textarea
                rows={6}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="SKU,CodigoBarras,Nombre,Categoria,Marca,PrecioCosto,PrecioVenta,StockActual,StockMinimo,StockMaximo,Unidad,Ubicacion..."
                className="w-full p-3 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleProcessImport}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  Procesar Importación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
