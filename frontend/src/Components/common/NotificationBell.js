import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NotificationBell.css'; 

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token'); 
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const resCount = await axios.get('http://localhost:5000/api/notifications/unread-count', config);
      setUnreadCount(resCount.data.count);
      
      if (isOpen) {
        const resList = await axios.get('http://localhost:5000/api/notifications', config);
        setNotifications(resList.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, event) => {
    event.stopPropagation();
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, config);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put('http://localhost:5000/api/notifications/mark-all-read', {}, config);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read', error);
    }
  };

  const navigateToComplaint = (complaintId) => {
    setIsOpen(false);
    if (!user) return;
    if (user.role === 'student') {
      navigate('/student-dashboard');
    } else if (user.role === 'admin') {
      navigate(`/admin/tickets/${complaintId}`);
    } else if (user.role === 'food_vendor') {
      navigate('/food-vendor-dashboard');
    }
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <div className="bell-container" onClick={() => setIsOpen(!isOpen)}>
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={handleMarkAllAsRead}>Mark all read</button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="empty-state">No notifications right now.</p>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif._id} 
                  className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
                  onClick={() => notif.relatedComplaintId && navigateToComplaint(notif.relatedComplaintId)}
                >
                  <div className="notif-content">
                    <h5>{notif.title}</h5>
                    <p>{notif.message}</p>
                    <small>{new Date(notif.createdAt).toLocaleString()}</small>
                  </div>
                  {!notif.isRead && (
                    <button className="mark-read-icon" onClick={(e) => handleMarkAsRead(notif._id, e)}>
                      ✓
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;