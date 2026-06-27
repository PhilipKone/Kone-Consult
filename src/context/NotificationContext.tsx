import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { updateAppBadge } from '../utils/pwa';

interface NotificationContextType {
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (
      !import.meta.env.VITE_FIREBASE_API_KEY ||
      import.meta.env.VITE_FIREBASE_API_KEY === 'dummy_key'
    ) {
      setUnreadCount(0);
      updateAppBadge(0);
      return;
    }

    if (!currentUser) {
      setUnreadCount(0);
      updateAppBadge(0);
      return;
    }

    // Determine if the user is an admin
    const isAdmin = ['phconsultgh@gmail.com', 'philipkone45@gmail.com'].includes(currentUser.email || '');

    let q;
    if (isAdmin) {
      // Admins see all unread contact messages
      q = query(collection(db, 'messages'), where('read', '==', false));
    } else {
      // Regular users might see unread replies (if we track them in a collection)
      // For now, we'll listen for messages sent TO their email that are unread
      // (This assumes we might send messages back to users in the same collection)
      q = query(collection(db, 'messages'), where('email', '==', currentUser.email), where('read', '==', false), where('type', '==', 'reply'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const count = snapshot.size;
      setUnreadCount(count);
      updateAppBadge(count);
    }, (error) => {
      console.warn('NotificationProvider: Error listening for messages', error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <NotificationContext.Provider value={{ unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
