

import React from "react";
import './App.css';
import { Routes, Route } from "react-router-dom";

// Import Owner component and Owner-related pages

import OwnerDashboard from './Components/owner/owner';
import RoomListing from './Components/owner/roomlisting';
import ManageRooms from './Components/owner/manageroom';
import BookingRequest from './Components/owner/bookingrequest';
import ReviewMaintenance from './Components/owner/reviewmaintenance';



//import student pages
/*
import RoomsDashboard from './Components/studenthome/roombooking';
import BookingPage from './Components/studenthome/bookingpage';
import ReviewsPage from './Components/studenthome/reviewpage';
*/
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Owner Dashboard */}
        
        <Route path="/" element={<OwnerDashboard />} />
        

        {/* Owner Pages */}
        
        <Route path="/roomlisting" element={<RoomListing />} />
        <Route path="/manage-rooms" element={<ManageRooms />} />
        <Route path="/booking-requests" element={<BookingRequest />} />
        <Route path="/reviews-maintenance" element={<ReviewMaintenance />} />
        

        {/* Student routes commented out for now */}
        {/*
        <Route path="/" element={<RoomsDashboard />} />
        <Route path="/booking/:roomId" element={<BookingPage />} />
        <Route path="/reviews/:roomId" element={<ReviewsPage />} />
        */}

      </Routes>
    </div>
  );
}

export default App;
