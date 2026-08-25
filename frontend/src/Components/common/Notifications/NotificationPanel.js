import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../../context/SocketContext';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead
} from '../../../services/notificationApi';
import './NotificationPanel.css';

const NotificationPanel = ({ userRole }) => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch notifications
  const fetchNotifications = useCallback(async (pageNum = 1, filterType = 'all') => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Fetching notifications...', { pageNum, filterType, userRole });
      
      const params = {
        page: pageNum,
        limit: 20,
        unreadOnly: filterType === 'unread'
      };

      const response = await getNotifications(params);
      
      console.log('✅ Notifications response:', response);
      
      if (response.success) {
        if (pageNum === 1) {
          setNotifications(response.data);
        } else {
          setNotifications(prev => [...prev, ...response.data]);
        }
        setHasMore(response.pagination.page < response.pagination.pages);
        setUnreadCount(response.unreadCount);
      }
    } catch (err) {
      console.error('❌ Notification fetch error:', err);
      console.error('❌ Error response:', err.response);
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();
      if (response.success) {
        setUnreadCount(response.count);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotifications(1, filter);
  }, [filter, fetchNotifications]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      console.log('New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo192.png'
        });
      }
    };

    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
    };
  }, [socket]);

  // Request browser notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read if unread
      if (!notification.isRead) {
        await markAsRead(notification._id);
        setNotifications(prev =>
          prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      // Navigate to ticket details
      if (notification.ticketId) {
        if (userRole === 'admin') {
          navigate(`/admin/tickets/${notification.ticketId}`);
        } else if (userRole === 'vendor') {
          navigate(`/vendor/tickets/${notification.ticketId}`);
        } else {
          // Student - trigger details view in dashboard
          navigate(`/student/dashboard?ticket=${notification.ticketId}`);
        }
      }
    } catch (err) {
      console.error('Error handling notification click:', err);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  // Delete notification
  const handleDelete = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Delete all read
  const handleDeleteAllRead = async () => {
    try {
      await deleteAllRead();
      setNotifications(prev => prev.filter(n => !n.isRead));
    } catch (err) {
      console.error('Error deleting read notifications:', err);
    }
  };

  // Load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage, filter);
    }
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ticket_created':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'ticket_replied':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'ticket_status_changed':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'ticket_closed':
      case 'ticket_resolved':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'ticket_escalated':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'warning_issued':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'ticket_assigned':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="notification-panel" style={{ minHeight: '400px', padding: '20px' }}>
      {/* Header */}
      <div className="notification-header">
        <div className="notification-header-left">
          <h2 className="notification-title">Notifications</h2>
          {unreadCount > 0 && (
            <span className="notification-unread-badge">{unreadCount}</span>
          )}
        </div>
        <div className="notification-header-actions">
          {unreadCount > 0 && (
            <button
              className="notification-action-btn"
              onClick={handleMarkAllAsRead}
              title="Mark all as read"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          <button
            className="notification-action-btn"
            onClick={handleDeleteAllRead}
            title="Delete all read"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="notification-filters">
        <button
          className={`notification-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => { setFilter('all'); setPage(1); }}
        >
          All
        </button>
        <button
          className={`notification-filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => { setFilter('unread'); setPage(1); }}
        >
          Unread
        </button>
      </div>

      {/* Notifications list */}
      <div className="notification-list">
        {error && (
          <div className="notification-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {loading && notifications.length === 0 ? (
          <div className="notification-loading">
            <div className="notification-spinner" />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            <div className="notification-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className={`notification-icon notification-icon-${notification.type}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-item-header">
                    <h4 className="notification-item-title">{notification.title}</h4>
                    <span className="notification-time">{formatTime(notification.createdAt)}</span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-meta">
                    <span className="notification-ticket-number">#{notification.ticketNumber}</span>
                    {notification.metadata?.serviceCategory && (
                      <span className="notification-category">{notification.metadata.serviceCategory}</span>
                    )}
                  </div>
                </div>
                <button
                  className="notification-delete-btn"
                  onClick={(e) => handleDelete(notification._id, e)}
                  title="Delete"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {!notification.isRead && <div className="notification-unread-dot" />}
              </div>
            ))}

            {hasMore && (
              <button
                className="notification-load-more"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
