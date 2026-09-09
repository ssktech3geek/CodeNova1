/**
 * @file NotificationContext.tsx
 * @module frontend/src/contexts
 * @description Notification Feed state for Traveler, Operator, and Vendor synchronization.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationItem } from '../types/disruption.types';
import { itineraryService } from '../services/itinerary.service';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notif: NotificationItem) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const refreshNotifications = async () => {
    try {
      const items = await itineraryService.getNotifications();
      setNotifications(items);
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  };

  useEffect(() => {
    refreshNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notif: NotificationItem) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isOpen,
        setIsOpen,
        markAsRead,
        markAllAsRead,
        addNotification,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
