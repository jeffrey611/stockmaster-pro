import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/inventory';
import { getCurrentUser, setCurrentUser, getUsers, saveUser } from '../services/storage';

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password?: string) => LoginResult;
  demoLogin: (role: UserRole) => void;
  register: (data: { name: string; email: string; password?: string; role: UserRole; title?: string }) => LoginResult;
  logout: () => void;
  switchUser: (user: User) => void;
  updateProfile: (updated: Partial<User>) => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setUserState] = useState<User | null>(() => getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => getUsers());

  useEffect(() => {
    // Keep users state in sync
    const currentUsers = getUsers();
    setUsers(currentUsers);
  }, []);

  const login = (email: string, password?: string): LoginResult => {
    const all = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = all.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return {
        success: false,
        error: `No existe ninguna cuenta asociada al correo ${email}. Puedes registrarte o usar el acceso rápido.`,
      };
    }

    if (password && found.password && found.password !== password) {
      return {
        success: false,
        error: 'Contraseña incorrecta. Revisa tus credenciales o accede con 1 clic desde el panel de evaluadores.',
      };
    }

    setUserState(found);
    setCurrentUser(found);
    return { success: true };
  };

  const demoLogin = (role: UserRole) => {
    const all = getUsers();
    let found = all.find((u) => u.role === role);
    if (!found) {
      found = all[0];
    }
    if (found) {
      setUserState(found);
      setCurrentUser(found);
    }
  };

  const register = (data: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    title?: string;
  }): LoginResult => {
    const all = getUsers();
    const cleanEmail = data.email.trim().toLowerCase();

    if (all.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: `Ya existe un usuario registrado con el correo ${data.email}. Inicia sesión en su lugar.`,
      };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password || 'password123',
      role: data.role,
      title:
        data.title?.trim() ||
        (data.role === 'admin'
          ? 'Administrador General'
          : data.role === 'almacenero'
          ? 'Gestor de Almacén'
          : 'Auditor de Control Interno'),
      avatarUrl:
        data.role === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
          : data.role === 'almacenero'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    const updatedUsers = getUsers();
    setUsers(updatedUsers);
    setUserState(newUser);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUserState(null);
    setCurrentUser(null);
  };

  const switchUser = (user: User) => {
    setUserState(user);
    setCurrentUser(user);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const modified: User = { ...currentUser, ...updated };
    saveUser(modified);
    setUserState(modified);
    setCurrentUser(modified);
    setUsers(getUsers());
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        demoLogin,
        register,
        logout,
        switchUser,
        updateProfile,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
