import React, { useState } from 'react';
import {
  Boxes,
  Lock,
  Mail,
  User,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Barcode,
  History,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/inventory';
import warehouseBannerImg from '../assets/images/warehouse_logistics_banner_1790187377900.jpg';

export const LoginPage: React.FC = () => {
  const { login, demoLogin, register, users } = useAuth();

  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'register'>('demo');
  const [email, setEmail] = useState('admin@stockmaster.com');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('admin');
  const [regTitle, setRegTitle] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const res = login(email, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Credenciales inválidas');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Por favor completa todos los campos requeridos');
      return;
    }
    const res = register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      title: regTitle,
    });
    if (!res.success) {
      setErrorMessage(res.error || 'Error al registrar usuario');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Graphic Scrim */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <img
          src={warehouseBannerImg}
          alt="Almacén Industrial"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950"></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium tracking-wide">
            <Boxes className="w-4 h-4 text-indigo-400" />
            <span>Enterprise Inventory & Warehouse System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            StockMaster <span className="text-indigo-400">Pro</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Portal de autenticación y control de acceso seguro para gestión de existencias y kardex
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Segmented Auth Mode Switcher */}
          <div className="grid grid-cols-3 p-1.5 bg-slate-950/80 border-b border-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setActiveTab('demo');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'demo'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Acceso 1-Clic</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Crear Cuenta</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Error Message banner */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: QUICK 1-CLICK DEMO (Best for Recruiters & Portfolios) */}
            {activeTab === 'demo' && (
              <div className="space-y-4">
                <div className="text-center space-y-1 mb-2">
                  <h3 className="text-sm font-bold text-white">Selecciona un Perfil para Evaluar el Sistema</h3>
                  <p className="text-xs text-slate-400">
                    Haz clic en cualquiera de los 3 perfiles para entrar de inmediato con permisos configurados
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Admin Card */}
                  <button
                    type="button"
                    onClick={() => demoLogin('admin')}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/80 hover:bg-slate-900 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                        CM
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                            Carlos Mendoza
                          </h4>
                          <span className="text-[10px] font-mono uppercase bg-indigo-950/80 text-indigo-400 border border-indigo-800/40 px-1.5 py-0.5 rounded font-semibold">
                            ADMINISTRADOR
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Control total: Catálogo, almacenes, configuración y finanzas</p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">admin@stockmaster.com · clave: admin</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  {/* Almacenero Card */}
                  <button
                    type="button"
                    onClick={() => demoLogin('almacenero')}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-emerald-500/80 hover:bg-slate-900 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                        VT
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                            Valeria Torres
                          </h4>
                          <span className="text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5 rounded font-semibold">
                            ALMACENERA
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Operaciones diarias: Entradas, despachos y escáner óptico</p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">almacen@stockmaster.com · clave: almacen</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  {/* Auditor Card */}
                  <button
                    type="button"
                    onClick={() => demoLogin('auditor')}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-amber-500/80 hover:bg-slate-900 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                        MS
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            Mateo Silva
                          </h4>
                          <span className="text-[10px] font-mono uppercase bg-amber-950/80 text-amber-400 border border-amber-800/40 px-1.5 py-0.5 rounded font-semibold">
                            AUDITOR
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Control de calidad: Kardex, actas de merma y análisis</p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">auditor@stockmaster.com · clave: auditor</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: TRADITIONAL LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@stockmaster.com"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">Contraseña</label>
                    <span className="text-[11px] text-slate-400">Clave demo: admin / almacen / auditor</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña..."
                      className="w-full pl-9 pr-10 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
                  >
                    <span>Iniciar Sesión en el Sistema</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('demo')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    ¿Prefieres acceder con 1 solo clic? Haz clic aquí
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: REGISTER NEW ACCOUNT */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nombre Completo</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="ej: Alejandro Ramos"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="usuario@empresa.com"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Rol en el Sistema</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="admin">Administrador (Control total)</option>
                      <option value="almacenero">Almacenero (Operaciones)</option>
                      <option value="auditor">Auditor (Control y actas)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Cargo / Puesto</label>
                    <input
                      type="text"
                      value={regTitle}
                      onChange={(e) => setRegTitle(e.target.value)}
                      placeholder="ej: Analista de Inventarios"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
                  >
                    <span>Crear Cuenta y Acceder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Highlights Footer */}
          <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
            <div className="flex flex-col items-center">
              <Barcode className="w-4 h-4 text-indigo-400 mb-1" />
              <span>Escáner Óptico</span>
            </div>
            <div className="flex flex-col items-center">
              <History className="w-4 h-4 text-emerald-400 mb-1" />
              <span>Kardex Contable</span>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="w-4 h-4 text-amber-400 mb-1" />
              <span>Valuación en Vivo</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Proyecto preparado para portafolio profesional · Repositorio GitHub con datos de prueba incluidos
        </p>
      </div>
    </div>
  );
};
