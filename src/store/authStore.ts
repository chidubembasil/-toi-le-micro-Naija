import { create } from "zustand";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setSessionId: (sessionId: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  sessionId: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  setSessionId: (sessionId) => {
    localStorage.setItem("sessionId", sessionId);
    set({ sessionId });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
    set({
      user: null,
      token: null,
      sessionId: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");

    if (token && sessionId) {
      set({
        token,
        sessionId,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },
}));
