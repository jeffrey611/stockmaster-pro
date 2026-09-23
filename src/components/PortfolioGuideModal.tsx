import React, { useState } from 'react';
import { X, Copy, Check, FolderGit2, ShieldCheck, Database, Layers, Terminal, Sparkles } from 'lucide-react';

interface PortfolioGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const PortfolioGuideModal: React.FC<PortfolioGuideModalProps> = ({ isOpen, onClose, onResetData }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const readmeContent = `# StockMaster Pro - Enterprise Inventory & Warehouse Management System

Sistema integral de gestión de inventario, control de existencias en tiempo real, trazabilidad por Kardex y administración de almacenes y proveedores, desarrollado como proyecto destacado para portafolio profesional de software.

![StockMaster Banner](https://raw.githubusercontent.com/username/stockmaster-pro/main/preview.png)

## 🚀 Características Principales

- 🔐 **Autenticación Basada en Roles (RBAC):** Perfiles diferenciados con permisos específicos:
  - **Administrador:** Control total sobre catálogo, altas, bajas, configuración y auditoría.
  - **Almacenero / Operador:** Registro de entradas, salidas, transferencias y escaneo óptico.
  - **Auditor de Calidad:** Verificación física, ajustes de merma y análisis de reportes.
- 📦 **Gestión Completa de Productos (CRUD):**
  - Generador automático de SKU y códigos de barras estándar EAN-13.
  - Control de umbrales: Stock Mínimo con alertas automáticas y Stock Máximo.
  - Cálculo en tiempo real de margen comercial bruto sobre costo.
  - Ubicación física granular (Almacén, Pasillo, Estante, Casillero).
- 📜 **Kardex y Trazabilidad de Movimientos:**
  - Registro inmutable de Entradas (compras/recepción), Salidas (ventas/despacho), Ajustes físicos y Transferencias entre almacenes.
  - Vinculación obligatoria con documento de referencia (facturas, remitos, órdenes).
  - Trazabilidad con fecha, hora y usuario responsable del movimiento.
- 🔍 **Escáner Óptico de Código de Barras:**
  - Simulador de lector láser con visor de puntería para pruebas rápidas.
  - Compatibilidad con pistolas USB de código de barras y búsqueda manual.
  - Acciones rápidas directamente desde el escáner (+1 / -1 existencias).
- 🏷️ **Impresión de Etiquetas Térmicas:**
  - Formato listo para imprimir rótulos adhesivos con código de barras y datos del SKU.
- 🏢 **Directorio de Proveedores y Almacenes:**
  - Tiempos de entrega (lead time), datos fiscales y capacidad de ocupación en almacenes.
- 📊 **Métricas y Análisis Financiero:**
  - Valoración total del inventario a precio de costo y venta.
  - Detección de productos en punto de quiebre (stock bajo o agotado).
- 📥 **Exportación e Importación de Datos:**
  - Exportar catálogo a CSV y movimientos a CSV.
  - Copia de seguridad completa en JSON.
  - Importador masivo de archivos CSV con validación de datos.

## 🛠️ Stack Tecnológico

- **Frontend:** React 19, TypeScript
- **Estilos:** Tailwind CSS v4 (diseño moderno, tipografía técnica, sin dependencias innecesarias)
- **Iconografía:** Lucide React
- **Persistencia:** LocalStorage sincronizado y blindado contra fallos
- **Arquitectura:** Componentes modulares, Context API para autenticación y servicios desacoplados

## 💻 Instalación y Ejecución Local

\`\`\`bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/stockmaster-pro.git

# 2. Entrar al directorio
cd stockmaster-pro

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo
npm run dev
\`\`\`

Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la aplicación funcionando.

## 👤 Cuentas Demo para Evaluación

- **Administrador:** \`admin@stockmaster.com\`
- **Almacenera:** \`almacen@stockmaster.com\`
- **Auditor:** \`auditor@stockmaster.com\`

*(El sistema incluye acceso rápido con 1 solo clic desde el botón de perfil o inicio de sesión)*.
`;

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Guía de Portafolio & GitHub</h2>
              <p className="text-xs text-slate-400">Documentación técnica lista para presentar a reclutadores</p>
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Hero Banner Box */}
          <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl flex items-start gap-4">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h3 className="font-semibold text-indigo-200">¡Tu aplicación está 100% lista para GitHub y Portafolio!</h3>
              <p className="text-slate-300 leading-relaxed">
                Esta solución incluye autenticación con 3 roles listos para probar, catálogo completo con búsqueda y filtros, kardex con trazabilidad contable, lector y generador de códigos de barras, importación y exportación de CSV y persistencia local sin necesidad de configurar bases de datos externas para que el reclutador la pruebe al instante.
              </p>
            </div>
          </div>

          {/* Key Architectural Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
                <ShieldCheck className="w-4 h-4" />
                <h4 className="text-xs font-semibold text-white">RBAC Enterprise</h4>
              </div>
              <p className="text-[11px] text-slate-400">
                Control de acceso con 3 roles independientes (Admin, Almacenero, Auditor) con permisos diferenciados.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-400 mb-1.5">
                <Database className="w-4 h-4" />
                <h4 className="text-xs font-semibold text-white">Kardex Inmutable</h4>
              </div>
              <p className="text-[11px] text-slate-400">
                Auditoría completa de movimientos con motivo, documento de respaldo, costo y stock previo/resultante.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400 mb-1.5">
                <Layers className="w-4 h-4" />
                <h4 className="text-xs font-semibold text-white">Turnkey Portfolio</h4>
              </div>
              <p className="text-[11px] text-slate-400">
                Cualquiera puede clonar el repositorio, ejecutar <code>npm install && npm run dev</code> y funciona de inmediato.
              </p>
            </div>
          </div>

          {/* Copy README Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-200 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>README.md Profesional Generado (Listo para pegar en tu repo de GitHub)</span>
              </label>
              <button
                type="button"
                onClick={handleCopyReadme}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado al Portapapeles!' : 'Copiar README.md'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56 leading-relaxed">
                {readmeContent}
              </pre>
            </div>
          </div>

          {/* Reset Demo Data for testing */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white">¿Hiciste pruebas y quieres volver al inicio?</h4>
              <p className="text-[11px] text-slate-400">
                Restaura el catálogo de productos y los movimientos a los datos de fábrica.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onResetData();
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-950/30 border border-amber-800/60 rounded-lg transition-colors"
            >
              Restaurar Datos Iniciales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
