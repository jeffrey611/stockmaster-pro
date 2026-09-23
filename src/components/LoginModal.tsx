import React, { useState } from 'react';
import { Shield, X, Check, Lock, User as UserIcon, Mail, Building2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/inventory';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, register, users } = useAuth();
  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'register'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('almacenero');
  const [regTitle, setRegTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleDemoSelect = (demoEmail: string) => {
    login(demoEmail);
    onClose();
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Ingresa un correo electrónico');
      return;
    }
    const res = login(email, password);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Usuario no encontrado. Usa uno de los accesos demo o regístrate.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim() || !regEmail.trim()) {
      setErrorMsg('Nombre y correo son obligatorios');
      return;
    }
    const res = register({
      name: regName,
      email: regEmail,
      password: regPassword || 'password123',
      role: regRole,
      title: regTitle,
    });
    if (res.success) {
      setSuccessMsg('Cuenta creada exitosamente');
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setErrorMsg(res.error || 'Error al registrar usuario');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">Control de Acceso</h2>
            <p className="text-xs text-slate-400">Selecciona un perfil o inicia sesión</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-1">
          <button
            onClick={() => {
              setActiveTab('demo');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'demo' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Acceso Rápido (Demo)
          </button>
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'login' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'register' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Body content */}
        <div className="p-5">
          {errorMsg && (
            <div className="mb-4 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-md text-xs text-rose-300">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-md text-xs text-emerald-300">
              {successMsg}
            </div>
          )}

          {activeTab === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-2">
                Ideal para evaluadores de portafolio y reclutadores. Haz clic en cualquier rol para ingresar con permisos completos:
              </p>

              {/* Admin Card */}
              <button
                type="button"
                onClick={() => handleDemoSelect('admin@stockmaster.com')}
                className="w-full text-left p-3 rounded-lg border border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-950/40 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                    ADM
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      Carlos Mendoza
                    </h4>
                    <p className="text-[11px] text-slate-400">admin@stockmaster.com · Administrador General</p>
                    <p className="text-[10px] text-indigo-400/90 mt-0.5">Control total: Crear, editar, borrar y auditar</p>
                  </div>
                </div>
                <div className="text-xs text-indigo-400 font-medium">Entrar →</div>
              </button>

              {/* Warehouse Card */}
              <button
                type="button"
                onClick={() => handleDemoSelect('almacen@stockmaster.com')}
                className="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    ALM
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      Valeria Torres
                    </h4>
                    <p className="text-[11px] text-slate-400">almacen@stockmaster.com · Supervisora de Almacén</p>
                    <p className="text-[10px] text-emerald-400/90 mt-0.5">Entradas, salidas, escáner e inventario físico</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 group-hover:text-white font-medium">Entrar →</div>
              </button>

              {/* Auditor Card */}
              <button
                type="button"
                onClick={() => handleDemoSelect('auditor@stockmaster.com')}
                className="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                    AUD
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                      Mateo Silva
                    </h4>
                    <p className="text-[11px] text-slate-400">auditor@stockmaster.com · Auditor de Calidad</p>
                    <p className="text-[10px] text-amber-400/90 mt-0.5">Ajustes de merma, reportes y revisión de kardex</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 group-hover:text-white font-medium">Entrar →</div>
              </button>
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ej: admin@stockmaster.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  En modo demo local cualquier contraseña es aceptada.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
              >
                Acceder al Sistema
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="ej: Andrés Morales"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="andres@empresa.com"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cargo / Puesto</label>
                <input
                  type="text"
                  value={regTitle}
                  onChange={(e) => setRegTitle(e.target.value)}
                  placeholder="ej: Operador Logístico"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Rol en el Sistema</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="admin">Administrador (Permisos totales)</option>
                  <option value="almacenero">Almacenero (Entradas, salidas y escáner)</option>
                  <option value="auditor">Auditor (Ajustes de inventario y reportes)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 px-4 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
              >
                Crear Cuenta & Entrar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
