import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  FolderGit2,
  ShieldCheck,
  Database,
  Layers,
  Terminal,
  Sparkles,
  ExternalLink,
  Download,
  Globe,
  User,
} from 'lucide-react';

interface PortfolioGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const PortfolioGuideModal: React.FC<PortfolioGuideModalProps> = ({ isOpen, onClose, onResetData }) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'readme'>('portfolio');
  const [copied, setCopied] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPortfolioHtml = () => {
    // Trigger download of portfolio.html
    const link = document.createElement('a');
    link.href = '/portfolio.html';
    link.download = 'jeffrey-amancio-portfolio.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('jeffreyamancio34@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

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
              <h2 className="text-base font-semibold text-white">Mi Portafolio & GitHub</h2>
              <p className="text-xs text-slate-400">Página de presentación personal y documentación de StockMaster Pro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800/80 bg-slate-950/40">
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'portfolio'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Mi Portafolio Web (HTML)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('readme')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'readme'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Documentación GitHub (README.md)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'portfolio' ? (
            <div className="space-y-6">
              {/* Personal Portfolio Hero Box */}
              <div className="p-5 bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-blue-500/40 shrink-0">
                      <img
                        src="./images/jeffrey_avatar_portrait_1790189340259.jpg"
                        alt="Jeffrey Amancio"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Jeffrey Amancio</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                          Fullstack & Frontend
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Especialista en React 19, TypeScript, Arquitecturas Enterprise y UI/UX
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="/portfolio.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Abrir Portafolio Web</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleDownloadPortfolioHtml}
                      className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Descargar .html</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 text-xs text-slate-300 leading-relaxed">
                  He creado tu archivo <strong>portfolio.html</strong> independiente, con diseño moderno, tipografías elegantes (Syne & Plus Jakarta Sans), tus habilidades técnicas, tarjeta de proyecto de StockMaster Pro con métricas y enlaces directos a tu GitHub.
                </div>
              </div>

              {/* Quick Profile Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Repositorio Oficial en GitHub</span>
                    <a
                      href="https://github.com/jeffrey611/stockmaster-pro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs font-mono text-slate-400 break-all">
                    github.com/jeffrey611/stockmaster-pro
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Correo de Contacto Profesional</span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEmail ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-xs font-mono text-slate-400 break-all">
                    jeffreyamancio34@gmail.com
                  </p>
                </div>
              </div>

              {/* What is included in your portfolio */}
              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  ¿Cómo puedes usar tu archivo portfolio.html?
                </h4>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">1.</span>
                    <span><strong>Subirlo a GitHub Pages:</strong> Puedes crear un repositorio llamado <code>jeffrey611.github.io</code> y subir este archivo como <code>index.html</code> para tener tu propio dominio gratuito.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">2.</span>
                    <span><strong>Compartirlo por correo o WhatsApp:</strong> Al hacer clic en <em>Descargar .html</em>, obtienes el archivo único que funciona sin necesidad de servidores externos ni dependencias.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">3.</span>
                    <span><strong>Adjuntarlo en postulaciones:</strong> Puedes incluir el enlace a tu GitHub y tu demo interactiva en cualquier plataforma de reclutamiento (LinkedIn, Upwork, Indeed).</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
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
        </div>
      )}

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
