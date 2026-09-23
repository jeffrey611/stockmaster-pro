# 📦 StockMaster Pro - Sistema de Gestión de Inventario & Almacenes

> Sistema integral de control de inventario en tiempo real, trazabilidad por Kardex, administración de almacenes, proveedores y escáner de códigos de barras. Desarrollado con **React 19**, **TypeScript** y **Tailwind CSS**.

---

## 🌟 Características Principales

### 1. 🔐 Autenticación Basada en Roles (RBAC)
- **Administrador General:** Control total sobre altas, bajas, configuración de almacenes, usuarios y auditoría financiera.
- **Encargado de Almacén:** Registro de entradas, salidas, transferencias y uso del escáner óptico.
- **Auditor de Calidad:** Generación de actas de inventario físico, ajustes por mermas y revisión de discrepancias.
- *Selector rápido con 1-click incluido para evaluadores y reclutadores.*

### 2. 📋 Catálogo Completo de Productos (CRUD)
- Generación automática de **SKU** y códigos de barras estándar **EAN-13**.
- Monitoreo de umbrales críticos: **Stock Mínimo (Alerta)** y **Stock Máximo**.
- Cálculo automático en tiempo real de **margen comercial bruto (%)** sobre costo.
- Ubicación física detallada: Almacén, Pasillo, Estantería y Casillero.

### 3. 📜 Kardex & Trazabilidad de Movimientos
- Registro inmutable de:
  - 📥 **Entradas:** Compras a proveedores, devoluciones.
  - 📤 **Salidas:** Despachos a clientes, consumo interno.
  - ⚖️ **Ajustes:** Roturas, mermas físicas, conciliaciones de inventario.
  - 🔄 **Traslados:** Transferencias entre diferentes centros de almacenamiento.
- Vinculación con documento de referencia contable (*Factura, Remito, Orden de Despacho*).
- Auditoría con fecha, hora, usuario responsable y cálculo de stock anterior y resultante.

### 4. 🔍 Escáner de Código de Barras & Generador
- Simulador visual de visor óptico con láser para pruebas rápidas sin hardware externo.
- Compatible con pistolas lectoras USB / Bluetooth estándar.
- Acciones rápidas directamente desde el escaneo: **+1 Entrada** / **-1 Salida**.
- **Impresión de rótulos térmicos adhesivos** con código de barras listo para pegarse en cajas o estantes.

### 5. 🏢 Directorio de Proveedores & Almacenes
- Control de tiempos de entrega (**Lead Time** en días).
- Identificación fiscal (CIF/NIF/RFC) y datos de contacto de ejecutivos de cuenta.
- Indicador de ocupación y capacidad máxima por almacén.

### 6. 📊 Métricas Financieras, Visualización con Recharts & Alertas Visuales
- **Gráfica Interactiva con Recharts:** Flujo de volumen de movimientos (Entradas vs Salidas) durante los últimos 7 días con desglose diario y balance neto.
- **Alertas Visuales Prioritarias (Cards & Badges):** Detección automática de artículos con existencias `<= stock mínimo`, discriminación por severidad (`CRÍTICO · AGOTADO` vs `ALERTA · STOCK BAJO`), badges de déficit de unidades, barras de progreso y botón de reposición rápida en 1 clic.
- Valuación patrimonial a costo (PMP) y proyección a precio de venta (PVP).
- Exportación del catálogo completo a **CSV**.
- Exportación del Kardex de movimientos a **CSV**.
- Respaldo íntegro de la base de datos en **JSON**.
- Importador masivo de archivos **CSV** con validación de cabeceras.

---

## 🛠️ Stack Tecnológico

- **Framework:** [React 19](https://react.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Visualización de Datos:** [Recharts](https://recharts.org/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Persistencia:** LocalStorage persistente con carga automática de datos demo de prueba
- **Herramienta de Construcción:** [Vite 6](https://vitejs.dev/)

---

## 🚀 Instalación y Puesta en Marcha

Para clonar y ejecutar este proyecto en tu entorno local:

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/stockmaster-pro.git

# 2. Navegar al directorio del proyecto
cd stockmaster-pro

# 3. Instalar las dependencias
npm install

# 4. Iniciar el servidor local de desarrollo
npm run dev
```

La aplicación estará disponible inmediatamente en `http://localhost:5173` (o `http://localhost:3000`).

---

## 👥 Cuentas de Acceso Rápido para Demostración

| Rol | Correo Electrónico | Perfil |
| :--- | :--- | :--- |
| **Administrador** | `admin@stockmaster.com` | Carlos Mendoza (Control Total) |
| **Almacenera** | `almacen@stockmaster.com` | Valeria Torres (Operaciones & Despachos) |
| **Auditor** | `auditor@stockmaster.com` | Mateo Silva (Control Interno & Ajustes) |

*(En el sistema puedes cambiar de perfil instantáneamente desde el menú superior derecho).*

---

## 📄 Licencia

Este proyecto está bajo la licencia [Apache 2.0](LICENSE).
Desarrollado para portafolio profesional de desarrollo web Full-Stack / Frontend.
