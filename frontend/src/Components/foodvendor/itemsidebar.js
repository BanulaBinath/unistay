import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './itemsidebar.css';

function ItemSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <h1>Order Manager</h1>
      <ul>
        <li><Link to="/vendor/food/dashboard">Food Vendor Profile</Link></li>
        <li><Link to="/ItemManagement">Item Management</Link></li>
        <li><Link to="/accept-item">Accept the Item</Link></li>
        <li><Link to="/complaint">Complaint</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </div>
  );
}

export default ItemSidebar;