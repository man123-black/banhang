import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
      },
      updateUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      }
    }),
    { name: 'myshop-auth' }
  )
);
