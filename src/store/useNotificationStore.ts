import { create } from 'zustand';
import { api } from '../api/apiClient';
import { Notification } from '../api/mockDb';

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  fetchNotifications: (userId: string) => Promise<void>;
  markAllRead: (userId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  isLoading: false,
  fetchNotifications: async (userId) => {
    set({ isLoading: true });
    try {
      const data = await api.notifications.list(userId);
      set({ notifications: data, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },
  markAllRead: async (userId) => {
    try {
      await api.notifications.markAllRead(userId);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));
