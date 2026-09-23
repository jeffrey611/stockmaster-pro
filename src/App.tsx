/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { MovementsView } from './components/MovementsView';
import { SuppliersView } from './components/SuppliersView';
import { WarehousesView } from './components/WarehousesView';
import { ReportsView } from './components/ReportsView';
import { ProductModal } from './components/ProductModal';
import { MovementModal } from './components/MovementModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { BarcodePrintModal } from './components/BarcodePrintModal';
import { PortfolioGuideModal } from './components/PortfolioGuideModal';
import { LoginModal } from './components/LoginModal';
import { LoginPage } from './components/LoginPage';
import {
  getProducts,
  saveProduct,
  deleteProduct,
  saveProducts,
  getMovements,
  recordMovement,
  getSuppliers,
  saveSupplier,
  deleteSupplier,
  getWarehouses,
  saveWarehouse,
  getCategories,
  calculateInventoryStats,
  resetDemoData,
} from './services/storage';
import { Product, Movement, Supplier, Warehouse, Category, MovementType } from './types/inventory';
import { Check, AlertCircle } from 'lucide-react';

function InventoryApp() {
  const { currentUser } = useAuth();

  // Tab State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Core Data State
  const [products, setProducts] = useState<Product[]>(() => getProducts());
  const [movements, setMovements] = useState<Movement[]>(() => getMovements());
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => getSuppliers());
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => getWarehouses());
  const [categories, setCategories] = useState<Category[]>(() => getCategories());

  // Modal States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<MovementType>('entrada');
  const [movementSelectedProduct, setMovementSelectedProduct] = useState<Product | null>(null);

  const [scannerModalOpen, setScannerModalOpen] = useState(false);

  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printProduct, setPrintProduct] = useState<Product | null>(null);

  const [portfolioGuideOpen, setPortfolioGuideOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Re-calculate stats reactively
  const stats = useMemo(() => {
    return calculateInventoryStats(products, movements, suppliers);
  }, [products, movements, suppliers]);

  // Product Operations
  const handleSaveProduct = (prod: Product) => {
    const isNew = !products.some((p) => p.id === prod.id);
    saveProduct(prod);
    const updated = getProducts();
    setProducts(updated);

    if (isNew) {
      // Auto-record initial stock movement if > 0
      if (prod.stock > 0) {
        recordMovement({
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          type: 'entrada',
          quantity: prod.stock,
          unitCost: prod.costPrice,
          referenceDoc: 'INVENTARIO-INICIAL',
          reason: 'Carga inicial de inventario al registrar SKU',
          userId: currentUser?.id || 'usr_admin',
          userName: currentUser?.name || 'Administrador',
          userRole: currentUser?.role || 'admin',
        });
        setMovements(getMovements());
      }
      showToast(`Producto "${prod.name}" registrado con éxito`);
    } else {
      showToast(`Producto "${prod.sku}" actualizado correctamente`);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const found = products.find((p) => p.id === productId);
    const ok = deleteProduct(productId);
    if (ok) {
      setProducts(getProducts());
      showToast(`Producto ${found?.sku || ''} eliminado del inventario`);
    }
  };

  const handleImportProducts = (newProducts: Product[]) => {
    const combined = [...newProducts, ...products];
    // deduplicate by SKU
    const uniqueMap = new Map<string, Product>();
    combined.forEach((p) => uniqueMap.set(p.sku, p));
    const finalProducts = Array.from(uniqueMap.values());
    saveProducts(finalProducts);
    setProducts(finalProducts);
    showToast(`Se importaron ${newProducts.length} productos satisfactoriamente`);
  };

  // Movement Operations
  const handleRecordMovement = (movementData: any) => {
    try {
      const result = recordMovement(movementData);
      setProducts(getProducts());
      setMovements(getMovements());
      showToast(
        `Movimiento registrado: ${movementData.type.toUpperCase()} de ${Math.abs(movementData.quantity)} unidades`
      );
    } catch (err: any) {
      showToast(err.message || 'Error al registrar movimiento', 'error');
    }
  };

  // Quick stock change from Scanner (+1 / -1)
  const handleQuickStockChange = (productId: string, delta: number, reason: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    try {
      recordMovement({
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        type: delta > 0 ? 'entrada' : 'salida',
        quantity: Math.abs(delta),
        unitCost: prod.costPrice,
        referenceDoc: 'ESCANER-OPTICO-RAPIDO',
        reason,
        userId: currentUser?.id || 'usr_almacen',
        userName: currentUser?.name || 'Operador',
        userRole: currentUser?.role || 'almacenero',
      });
      setProducts(getProducts());
      setMovements(getMovements());
      showToast(`Stock actualizado: ${delta > 0 ? '+1' : '-1'} en ${prod.sku}`);
    } catch (err: any) {
      showToast(err.message || 'Error al cambiar stock', 'error');
    }
  };

  // Supplier Operations
  const handleSaveSupplier = (supplier: Supplier) => {
    saveSupplier(supplier);
    setSuppliers(getSuppliers());
    showToast(`Proveedor "${supplier.name}" guardado exitosamente`);
  };

  const handleDeleteSupplier = (supplierId: string) => {
    deleteSupplier(supplierId);
    setSuppliers(getSuppliers());
    showToast('Proveedor eliminado del directorio');
  };

  // Warehouse Operations
  const handleSaveWarehouse = (wh: Warehouse) => {
    saveWarehouse(wh);
    setWarehouses(getWarehouses());
    showToast(`Almacén "${wh.name}" guardado`);
  };

  // Reset Demo Data
  const handleResetData = () => {
    resetDemoData();
    setProducts(getProducts());
    setMovements(getMovements());
    setSuppliers(getSuppliers());
    setWarehouses(getWarehouses());
    setCategories(getCategories());
    showToast('Datos de demostración restaurados a valores iniciales');
  };

  // If user is not authenticated, display full Login Gateway
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenScanner={() => setScannerModalOpen(true)}
        onOpenNewProduct={() => {
          setEditingProduct(null);
          setProductModalOpen(true);
        }}
        onOpenNewMovement={(type = 'entrada') => {
          setMovementType(type);
          setMovementSelectedProduct(null);
          setMovementModalOpen(true);
        }}
        onOpenPortfolioGuide={() => setPortfolioGuideOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            products={products}
            movements={movements}
            warehouses={warehouses}
            onOpenProductModal={() => {
              setEditingProduct(null);
              setProductModalOpen(true);
            }}
            onOpenMovementModal={(type, product) => {
              setMovementType(type);
              setMovementSelectedProduct(product || null);
              setMovementModalOpen(true);
            }}
            onOpenScanner={() => setScannerModalOpen(true)}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'productos' && (
          <ProductsView
            products={products}
            warehouses={warehouses}
            categories={categories}
            suppliers={suppliers}
            onOpenNewProduct={() => {
              setEditingProduct(null);
              setProductModalOpen(true);
            }}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setProductModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onOpenMovement={(p, type) => {
              setMovementType(type);
              setMovementSelectedProduct(p);
              setMovementModalOpen(true);
            }}
            onPrintBarcode={(p) => {
              setPrintProduct(p);
              setPrintModalOpen(true);
            }}
            onImportProducts={handleImportProducts}
          />
        )}

        {currentTab === 'movimientos' && (
          <MovementsView
            movements={movements}
            onOpenNewMovement={(type = 'entrada') => {
              setMovementType(type);
              setMovementSelectedProduct(null);
              setMovementModalOpen(true);
            }}
          />
        )}

        {currentTab === 'proveedores' && (
          <SuppliersView
            suppliers={suppliers}
            products={products}
            onSaveSupplier={handleSaveSupplier}
            onDeleteSupplier={handleDeleteSupplier}
          />
        )}

        {currentTab === 'almacenes' && (
          <WarehousesView
            warehouses={warehouses}
            products={products}
            onSaveWarehouse={handleSaveWarehouse}
          />
        )}

        {currentTab === 'reportes' && (
          <ReportsView
            stats={stats}
            products={products}
            movements={movements}
            suppliers={suppliers}
            warehouses={warehouses}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} StockMaster Pro · Sistema de Gestión de Inventario para Portafolio</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPortfolioGuideOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Documentación GitHub / README
            </button>
            <span>·</span>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-white"
            >
              Restaurar Datos Iniciales
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
        suppliers={suppliers}
        warehouses={warehouses}
        categories={categories}
      />

      <MovementModal
        isOpen={movementModalOpen}
        onClose={() => setMovementModalOpen(false)}
        products={products}
        warehouses={warehouses}
        currentUser={currentUser}
        defaultType={movementType}
        selectedProduct={movementSelectedProduct}
        onRecordMovement={handleRecordMovement}
      />

      <BarcodeScannerModal
        isOpen={scannerModalOpen}
        onClose={() => setScannerModalOpen(false)}
        products={products}
        onQuickStockChange={handleQuickStockChange}
        onOpenMovement={(prod, type) => {
          setMovementType(type);
          setMovementSelectedProduct(prod);
          setMovementModalOpen(true);
        }}
      />

      <BarcodePrintModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        product={printProduct}
      />

      <PortfolioGuideModal
        isOpen={portfolioGuideOpen}
        onClose={() => setPortfolioGuideOpen(false)}
        onResetData={handleResetData}
      />

      <LoginModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/60'
                : 'bg-rose-950/90 text-rose-200 border-rose-700/60'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InventoryApp />
    </AuthProvider>
  );
}
