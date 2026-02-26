import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number; // ms, default 3000
}

interface NotificationContextType {
    notifications: Notification[];
    showSuccess: (message: string, duration?: number) => void;
    showError: (message: string, duration?: number) => void;
    showInfo: (message: string, duration?: number) => void;
    showWarning: (message: string, duration?: number) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const generateId = () => `notification-${Date.now()}-${Math.random()}`;

    const addNotification = useCallback((type: NotificationType, message: string, duration = 3000) => {
        const id = generateId();
        const notification: Notification = { id, type, message, duration };

        setNotifications(prev => [...prev, notification]);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const showSuccess = useCallback((message: string, duration?: number) => {
        addNotification('success', message, duration);
    }, [addNotification]);

    const showError = useCallback((message: string, duration?: number) => {
        addNotification('error', message, duration);
    }, [addNotification]);

    const showInfo = useCallback((message: string, duration?: number) => {
        addNotification('info', message, duration);
    }, [addNotification]);

    const showWarning = useCallback((message: string, duration?: number) => {
        addNotification('warning', message, duration);
    }, [addNotification]);

    const value: NotificationContextType = {
        notifications,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        removeNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification must be used within NotificationProvider');
    return context;
};
