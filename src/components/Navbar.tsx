import React, { useState } from 'react';
import {
  Boxes,
  Barcode,
  FolderGit2,
  LogOut,
  UserCheck,
  ChevronDown,
  RotateCcw,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Shield,
  Warehouse as WarehouseIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/inventory';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenScanner: () => void;
  onOpenNewProduct: () => void;
  onOpenNewMovement: (type?: 'entrada' | 'salida') => void;
  onOpenPortfolioGuide: () => void;
  onOpenAuthModal: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenScanner,
  onOpenNewProduct,
  onOpenNewMovement,
  onOpenPortfolioGuide,
  onOpenAuthModal,
  onResetData,
}) => {
  const { currentUser, logout, switchUser, users } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'productos', label: 'Inventario' },
    { id: 'movimientos', label: 'Kardex' },
    { id: 'proveedores', label: 'Proveedores' },
    { id: 'almacenes', label: 'Almacenes' },
    { id: 'reportes', label: 'Reportes' },
  ];

  const getRoleLabel = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'almacenero':
        return 'Almacén';
      case 'auditor':
        return 'Auditor';
      default:
        return 'Invitado';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Boxes className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">StockMaster Pro</span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-indigo-400 border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & User menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick barcode scan */}
            <button
              onClick={onOpenScanner}
              title="Abrir Escáner de Código de Barras"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors"
            >
              <Barcode className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Escanear</span>
            </button>

            {/* Quick entry / exit for warehouse ops */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-md border border-slate-800">
              <button
                onClick={() => onOpenNewMovement('entrada')}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-950/30 rounded transition-colors"
                title="Registrar Entrada rápida de stock"
              >
                <ArrowDownLeft className="w-3 h-3" />
                <span>Entrada</span>
              </button>
              <button
                onClick={() => onOpenNewMovement('salida')}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                title="Registrar Salida rápida de stock"
              >
                <ArrowUpRight className="w-3 h-3" />
                <span>Salida</span>
              </button>
            </div>

            {/* Portfolio & GitHub Guide */}
            <button
              onClick={onOpenPortfolioGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-600/40 rounded-md transition-colors shadow-sm"
              title="Ver mi portafolio web personal, habilidades y documentación"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Mi Portafolio</span>
            </button>

            {/* User profile / Quick Role Switcher */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-700"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-medium text-slate-200 leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight">
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-lg bg-slate-900 border border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-indigo-400">
                        <Shield className="w-3 h-3" />
                        <span>Rol: {getRoleLabel(currentUser.role)}</span>
                      </div>
                    </div>

                    <div className="px-3 py-1.5 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                      Cambiar Rol Rápido (Demo)
                    </div>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                          u.id === currentUser.id ? 'text-indigo-400 font-medium' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{u.name}</span>
                          <span className="text-[10px] text-slate-400">{getRoleLabel(u.role)}</span>
                        </div>
                        {u.id === currentUser.id && <UserCheck className="w-3.5 h-3.5" />}
                      </button>
                    ))}

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onResetData();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-950/20 flex items-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar datos demo</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/20 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
              >
                Acceso / Iniciar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden border-t border-slate-800/80 px-2 py-1.5 flex items-center overflow-x-auto gap-1">
        {navLinks.map((link) => {
          const isActive = currentTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                isActive ? 'bg-slate-800 text-indigo-400 font-semibold' : 'text-slate-400'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
