import { create } from 'zustand';
import { api } from '../api/apiClient';
import { User } from '../api/mockDb';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, phone: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const getStoredSession = () => {
  const session = localStorage.getItem("rxflow_session");
  if (session) {
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  }
  return null;
};

const session = getStoredSession();

export const useAuthStore = create<AuthState>((set) => ({
  user: session?.user || null,
  token: session?.token || null,
  isAuthenticated: !!session?.token,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.auth.login(email, password);
      localStorage.setItem("rxflow_session", JSON.stringify({ user: res.user, token: res.token }));
      set({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Login failed", isLoading: false });
      throw err;
    }
  },
  
  register: async (email, name, phone) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.auth.register(email, name, phone);
      localStorage.setItem("rxflow_session", JSON.stringify({ user: res.user, token: res.token }));
      set({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Registration failed", isLoading: false });
      throw err;
    }
  },
  
  logout: () => {
    localStorage.removeItem("rxflow_session");
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const sessionStr = localStorage.getItem("rxflow_session");
      if (!sessionStr) throw new Error("No active session");
      const session = JSON.parse(sessionStr);
      const updatedUser = await api.auth.updateProfile(session.user.id, data);
      set({ user: updatedUser, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Profile update failed", isLoading: false });
      throw err;
    }
  },
  
  clearError: () => set({ error: null })
}));
