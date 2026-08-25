import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../context/SocketContext';
import { getUnreadCount } from '../../../services/notificationApi';
import './NotificationBell.css';

const NotificationBell = ({ onClick }) => {
  const { socket } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const pulseTimeoutRef = useRef(null);

  // Fetch initial unread count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await getUnreadCount();
        if (response.success) {
          setUnreadCount(response.count);
        }
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    };

    fetchCount();
  }, []);

  // Listen for new notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      setUnreadCount(prev => prev + 1);
      
      // Show pulse animation
      setShowPulse(true);
      
      // Clear existing timeout
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
      
      // Remove pulse after animation
      pulseTimeoutRef.current = setTimeout(() => {
        setShowPulse(false);
      }, 1000);
    };

    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, [socket]);

  return (
    <button 
      className={`notification-bell ${showPulse ? 'pulse' : ''}`}
      onClick={onClick}
      title="Notifications"
    >
      <svg 
        className="notification-bell-icon" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
        />
      </svg>
      {unreadCount > 0 && (
        <span className="notification-bell-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
