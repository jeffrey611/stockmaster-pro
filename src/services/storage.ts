import { Product, Movement, Supplier, Warehouse, User, Category, InventoryStats } from '../types/inventory';
import {
  INITIAL_PRODUCTS,
  INITIAL_MOVEMENTS,
  INITIAL_SUPPLIERS,
  INITIAL_WAREHOUSES,
  INITIAL_USERS,
  INITIAL_CATEGORIES,
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'stockmaster_products_v1',
  MOVEMENTS: 'stockmaster_movements_v1',
  SUPPLIERS: 'stockmaster_suppliers_v1',
  WAREHOUSES: 'stockmaster_warehouses_v1',
  USERS: 'stockmaster_users_v1',
  CATEGORIES: 'stockmaster_categories_v1',
  CURRENT_USER: 'stockmaster_current_user_v1',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error loading key ${key} from storage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key} to storage:`, e);
  }
}

// ------------------- PRODUCTS -------------------
export function getProducts(): Product[] {
  const data = safeGet<Product[] | null>(STORAGE_KEYS.PRODUCTS, null);
  if (!data || data.length === 0) {
    safeSet(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
  return data;
}

export function saveProducts(products: Product[]): void {
  safeSet(STORAGE_KEYS.PRODUCTS, products);
}

export function saveProduct(product: Product): Product {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === product.id);
  const now = new Date().toISOString();

  let updatedList: Product[];
  if (index >= 0) {
    updatedList = [...products];
    updatedList[index] = { ...product, updatedAt: now };
  } else {
    updatedList = [{ ...product, createdAt: now, updatedAt: now }, ...products];
  }
  saveProducts(updatedList);
  return product;
}

export function deleteProduct(productId: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== productId);
  if (filtered.length !== products.length) {
    saveProducts(filtered);
    return true;
  }
  return false;
}

// ------------------- MOVEMENTS (KARDEX) -------------------
export function getMovements(): Movement[] {
  const data = safeGet<Movement[] | null>(STORAGE_KEYS.MOVEMENTS, null);
  if (!data || data.length === 0) {
    safeSet(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
    return INITIAL_MOVEMENTS;
  }
  return data;
}

export function recordMovement(
  movementData: Omit<Movement, 'id' | 'timestamp' | 'previousStock' | 'newStock' | 'totalCost'>
): { movement: Movement; updatedProduct: Product } {
  const products = getProducts();
  const product = products.find((p) => p.id === movementData.productId);

  if (!product) {
    throw new Error('Producto no encontrado en inventario');
  }

  const prevStock = product.stock;
  let newStock = prevStock;

  if (movementData.type === 'entrada') {
    newStock = prevStock + Math.abs(movementData.quantity);
  } else if (movementData.type === 'salida') {
    if (prevStock < Math.abs(movementData.quantity)) {
      throw new Error(`Stock insuficiente. Stock actual: ${prevStock}, cantidad a retirar: ${movementData.quantity}`);
    }
    newStock = Math.max(0, prevStock - Math.abs(movementData.quantity));
  } else if (movementData.type === 'ajuste') {
    // If quantity is negative or positive difference
    newStock = prevStock + movementData.quantity;
    if (newStock < 0) {
      throw new Error('El ajuste no puede dejar el stock en negativo');
    }
  } else if (movementData.type === 'transferencia') {
    // Transfer from warehouse to warehouse doesn't change global stock if in same product record
    if (movementData.targetWarehouseId) {
      product.warehouseId = movementData.targetWarehouseId;
    }
  }

  const updatedProduct: Product = {
    ...product,
    stock: newStock,
    updatedAt: new Date().toISOString(),
  };

  saveProduct(updatedProduct);

  const newMovement: Movement = {
    ...movementData,
    id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    previousStock: prevStock,
    newStock: newStock,
    totalCost: Math.abs(movementData.quantity) * (movementData.unitCost || product.costPrice),
    timestamp: new Date().toISOString(),
  };

  const movements = getMovements();
  const updatedMovements = [newMovement, ...movements];
  safeSet(STORAGE_KEYS.MOVEMENTS, updatedMovements);

  return { movement: newMovement, updatedProduct };
}

// ------------------- SUPPLIERS -------------------
export function getSuppliers(): Supplier[] {
  const data = safeGet<Supplier[] | null>(STORAGE_KEYS.SUPPLIERS, null);
  if (!data || data.length === 0) {
    safeSet(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    return INITIAL_SUPPLIERS;
  }
  return data;
}

export function saveSupplier(supplier: Supplier): Supplier {
  const suppliers = getSuppliers();
  const idx = suppliers.findIndex((s) => s.id === supplier.id);
  let updated: Supplier[];
  if (idx >= 0) {
    updated = [...suppliers];
    updated[idx] = supplier;
  } else {
    updated = [supplier, ...suppliers];
  }
  safeSet(STORAGE_KEYS.SUPPLIERS, updated);
  return supplier;
}

export function deleteSupplier(supplierId: string): boolean {
  const suppliers = getSuppliers();
  const filtered = suppliers.filter((s) => s.id !== supplierId);
  if (filtered.length !== suppliers.length) {
    safeSet(STORAGE_KEYS.SUPPLIERS, filtered);
    return true;
  }
  return false;
}

// ------------------- WAREHOUSES -------------------
export function getWarehouses(): Warehouse[] {
  const data = safeGet<Warehouse[] | null>(STORAGE_KEYS.WAREHOUSES, null);
  if (!data || data.length === 0) {
    safeSet(STORAGE_KEYS.WAREHOUSES, INITIAL_WAREHOUSES);
    return INITIAL_WAREHOUSES;
  }
  return data;
}

export function saveWarehouse(wh: Warehouse): Warehouse {
  const warehouses = getWarehouses();
  const idx = warehouses.findIndex((w) => w.id === wh.id);
  let updated: Warehouse[];
  if (idx >= 0) {
    updated = [...warehouses];
    updated[idx] = wh;
  } else {
    updated = [...warehouses, wh];
  }
  safeSet(STORAGE_KEYS.WAREHOUSES, updated);
  return wh;
}

// ------------------- CATEGORIES -------------------
export function getCategories(): Category[] {
  const data = safeGet<Category[] | null>(STORAGE_KEYS.CATEGORIES, null);
  if (!data || data.length === 0) {
    safeSet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return INITIAL_CATEGORIES;
  }
  return data;
}

// ------------------- USERS & AUTH -------------------
export function getUsers(): User[] {
  const data = safeGet<User[] | null>(STORAGE_KEYS.USERS, null);
  if (!data || data.length === 0) {
    safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
    return INITIAL_USERS;
  }
  return data;
}

export function saveUser(user: User): User {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  let updated: User[];
  if (idx >= 0) {
    updated = [...users];
    updated[idx] = user;
  } else {
    updated = [...users, user];
  }
  safeSet(STORAGE_KEYS.USERS, updated);
  return user;
}

export function getCurrentUser(): User | null {
  return safeGet<User | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user: User | null): void {
  if (user === null) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    safeSet(STORAGE_KEYS.CURRENT_USER, user);
  }
}

// ------------------- STATS & METRICS -------------------
export function calculateInventoryStats(products: Product[], movements: Movement[], suppliers: Supplier[]): InventoryStats {
  let totalUnits = 0;
  let totalValuationCost = 0;
  let totalValuationRetail = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  products.forEach((p) => {
    totalUnits += p.stock;
    totalValuationCost += p.stock * p.costPrice;
    totalValuationRetail += p.stock * p.sellingPrice;
    if (p.stock <= 0) {
      outOfStockCount++;
    } else if (p.stock <= p.minStock) {
      lowStockCount++;
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const movementsToday = movements.filter((m) => m.timestamp.startsWith(todayStr)).length;

  return {
    totalProducts: products.length,
    totalUnits,
    totalValuationCost,
    totalValuationRetail,
    lowStockCount,
    outOfStockCount,
    totalSuppliers: suppliers.length,
    movementsToday,
  };
}

// ------------------- RESET DEMO DATA -------------------
export function resetDemoData(): void {
  safeSet(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  safeSet(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
  safeSet(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  safeSet(STORAGE_KEYS.WAREHOUSES, INITIAL_WAREHOUSES);
  safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
  safeSet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  safeSet(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
}

// ------------------- EXPORT HELPERS -------------------
export function exportProductsToCSV(products: Product[]): void {
  const headers = [
    'SKU',
    'CodigoBarras',
    'Nombre',
    'Categoria',
    'Marca',
    'PrecioCosto',
    'PrecioVenta',
    'StockActual',
    'StockMinimo',
    'StockMaximo',
    'Unidad',
    'UbicacionPasillo',
  ];

  const rows = products.map((p) => [
    `"${p.sku}"`,
    `"${p.barcode}"`,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.category}"`,
    `"${p.brand}"`,
    p.costPrice.toFixed(2),
    p.sellingPrice.toFixed(2),
    p.stock,
    p.minStock,
    p.maxStock,
    `"${p.unit}"`,
    `"${p.aisleRack}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `inventario_stockmaster_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportMovementsToCSV(movements: Movement[]): void {
  const headers = [
    'Fecha',
    'Tipo',
    'Producto',
    'SKU',
    'Cantidad',
    'StockAnterior',
    'StockNuevo',
    'CostoUnitario',
    'TotalCosto',
    'DocumentoRef',
    'Motivo',
    'Usuario',
    'Rol',
  ];

  const rows = movements.map((m) => [
    `"${new Date(m.timestamp).toLocaleString('es-ES')}"`,
    `"${m.type.toUpperCase()}"`,
    `"${m.productName.replace(/"/g, '""')}"`,
    `"${m.sku}"`,
    m.quantity,
    m.previousStock,
    m.newStock,
    m.unitCost.toFixed(2),
    m.totalCost.toFixed(2),
    `"${m.referenceDoc}"`,
    `"${m.reason.replace(/"/g, '""')}"`,
    `"${m.userName}"`,
    `"${m.userRole}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `kardex_movimientos_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportBackupJSON(): void {
  const data = {
    exportedAt: new Date().toISOString(),
    system: 'StockMaster Pro',
    version: '1.0.0',
    products: getProducts(),
    movements: getMovements(),
    suppliers: getSuppliers(),
    warehouses: getWarehouses(),
    users: getUsers(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `backup_stockmaster_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ------------------- IMPORT CSV -------------------
export function parseCSVProducts(csvText: string): { products: Product[]; errors: string[] } {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const errors: string[] = [];
  const importedProducts: Product[] = [];

  if (lines.length < 2) {
    errors.push('El archivo CSV está vacío o solo contiene la cabecera');
    return { products: [], errors };
  }

  // Expecting format: SKU, CodigoBarras, Nombre, Categoria, Marca, PrecioCosto, PrecioVenta, StockActual, StockMinimo, StockMaximo, Unidad, Ubicacion
  const currentWarehouses = getWarehouses();
  const defaultWh = currentWarehouses[0]?.id || 'wh_central';
  const defaultSup = getSuppliers()[0]?.id || 'sup_synnex';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV parser supporting quotes
    const values: string[] = [];
    let insideQuotes = false;
    let currentValue = '';

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    if (values.length < 5) {
      errors.push(`Línea ${i + 1}: Faltan columnas mínimas requeridas`);
      continue;
    }

    const sku = values[0].replace(/^"|"$/g, '');
    const barcode = values[1] ? values[1].replace(/^"|"$/g, '') : `77900${Math.floor(1000000 + Math.random() * 9000000)}`;
    const name = values[2] ? values[2].replace(/^"|"$/g, '') : '';
    const category = values[3] ? values[3].replace(/^"|"$/g, '') : 'General';
    const brand = values[4] ? values[4].replace(/^"|"$/g, '') : 'Genérico';
    const costPrice = parseFloat(values[5]) || 0;
    const sellingPrice = parseFloat(values[6]) || costPrice * 1.35;
    const stock = parseInt(values[7], 10) || 0;
    const minStock = parseInt(values[8], 10) || 5;
    const maxStock = parseInt(values[9], 10) || 100;
    const unit = (values[10]?.replace(/^"|"$/g, '') as any) || 'unidades';
    const aisleRack = values[11] ? values[11].replace(/^"|"$/g, '') : 'Área General';

    if (!sku || !name) {
      errors.push(`Línea ${i + 1}: SKU y Nombre son obligatorios`);
      continue;
    }

    const newProd: Product = {
      id: `prod_csv_${Date.now()}_${i}`,
      sku,
      barcode,
      name,
      description: `Producto importado vía CSV - ${name}`,
      category,
      brand,
      costPrice,
      sellingPrice,
      stock,
      minStock,
      maxStock,
      unit,
      warehouseId: defaultWh,
      aisleRack,
      supplierId: defaultSup,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    importedProducts.push(newProd);
  }

  return { products: importedProducts, errors };
}
