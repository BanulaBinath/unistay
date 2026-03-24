import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './FoodVendorDashboard.css';
import ItemSidebar from '../foodvendor/itemsidebar'; 

function FoodVendorDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      
       
      

            <ItemSidebar />


      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.fullName}!</h2>
          <p>Business: {user?.businessName || 'N/A'}</p>
          <p>Email: {user?.email}</p>
          <p>Vendor Type: Food</p>
          <p className="status-badge">Status: Active</p>
        </div>

      
      </div>
    </div>
  );
}

export default FoodVendorDashboard;
