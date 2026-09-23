export type UserRole = 'admin' | 'almacenero' | 'auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  avatarUrl?: string;
  title?: string;
  createdAt: string;
}

export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  maxStock: number;
  unit: 'unidades' | 'cajas' | 'paquetes' | 'kg' | 'metros';
  warehouseId: string;
  aisleRack: string;
  supplierId: string;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'entrada' | 'salida' | 'ajuste' | 'transferencia';

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  unitCost: number;
  totalCost: number;
  referenceDoc: string;
  reason: string;
  sourceWarehouseId?: string;
  targetWarehouseId?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  timestamp: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  taxId: string;
  address: string;
  category: string;
  leadTimeDays: number;
  status: 'active' | 'inactive';
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  capacityUnits: number;
  managerName: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  iconName: string;
}

export interface InventoryStats {
  totalProducts: number;
  totalUnits: number;
  totalValuationCost: number;
  totalValuationRetail: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalSuppliers: number;
  movementsToday: number;
}
