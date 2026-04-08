import React from "react";
import './App.css';
import { Routes, Route } from "react-router-dom";

// 🔹 Auth
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";

// 🔹 Public
import NomalHome from './Components/Home/nomalhome';
import Login from './Components/Home/login';
import RegisterSelection from './Components/Home/RegisterSelection';
import SLIITStudentRegister from './Components/Home/SLIITStudentRegister';
import OTPVerification from './Components/Home/OTPVerification';
import ExternalStudentRegister from './Components/Home/ExternalStudentRegister';
import VendorRegister from './Components/Home/VendorRegister';
import PaymentProcess from './Components/Home/PaymentProcess';
import Services from './Components/pages/Services';
import About from './Components/pages/About';
import AboutUs from './Components/Home/AboutUs';
import ContactPage from './Components/pages/Contact';
import Contact from './Components/Home/Contact';

// 🔹 Owner
import OwnerDashboard from './Components/owner/owner';
import RoomListing from './Components/owner/roomlisting';
import ManageRooms from './Components/owner/manageroom';
import BookingRequest from './Components/owner/bookingrequest';
import ReviewMaintenance from './Components/owner/reviewmaintenance';

// 🔹 Admin
import AdminDashboard from './Components/admin/AdminDashboard';

// 🔹 Student
import StudentDashboard from './Components/studenthome/studenthome';
import CreateComplaintPage from './pages/student/CreateComplaintPage';
import MyTicketsPage from './pages/student/MyTicketsPage';
import TicketDetailsPage from './pages/student/TicketDetailsPage';
import OrderHistoryPage from './pages/student/OrderHistoryPage';
import OrderDetailsPage from './pages/student/OrderDetailsPage';
import MyFoodOrders from './pages/student/MyFoodOrders';

import RoomsDashboard from './Components/studenthome/roombooking';
import BookingPage from './Components/studenthome/bookingpage';
import ReviewsPage from './Components/studenthome/reviewpage';
import BuyOrderPage from './Components/studenthome/foodorder';
import FoodVendor from './Components/foodvendor/foodvendor';
import AddItem from './Components/foodvendor/addItem';
import UpdateItem from './Components/foodvendor/updateitem';
import AcceptItem from './Components/foodvendor/AcceptItem';
import Complaint from './Components/foodvendor/foodVendorcomplaint';
import BuyOrderPage from './Components/studenthome/foodorder';

// 🔹 Vendor
import FoodVendorDashboard from './Components/foodvendor/foodvendor';
import AddItem from './Components/foodvendor/addItem';
import UpdateItem from './Components/foodvendor/updateitem';
import AcceptItem from './Components/foodvendor/AcceptItem';
import Complaint from './Components/foodvendor/foodVendorcomplaint';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<NomalHome />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterSelection />} />
          <Route path="/register/sliit-student" element={<SLIITStudentRegister />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/register/external-student" element={<ExternalStudentRegister />} />
          <Route path="/register/vendor" element={<VendorRegister />} />
          <Route path="/payment/process" element={<PaymentProcess />} />
          <Route path="/buyorder" element={<BuyOrderPage />} />


          {/* Student */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="/student/complaints/new" element={
            <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
              <CreateComplaintPage />
            </ProtectedRoute>
          } />

          <Route path="/student/complaints" element={
            <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
              <MyTicketsPage />
            </ProtectedRoute>
          } />

          <Route path="/student/complaints/:id" element={
            <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
              <TicketDetailsPage />
            </ProtectedRoute>
          } />

          <Route 
            path="/student/orders" 
            element={
              <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
                <MyFoodOrders />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/student/orders/history" 
            element={
              <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
                <OrderHistoryPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/student/orders/:orderId" 
            element={
              <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
                <OrderDetailsPage />
              </ProtectedRoute>
            } 
          />

          {/* Vendor Dashboards */}
          <Route 
            path="/vendor/food/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['vendor']} allowedVendorTypes={['food']}>
                <FoodVendorDashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="/student/orders/history" element={
            <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
              <OrderHistoryPage />
            </ProtectedRoute>
          } />

          <Route path="/student/orders/:orderId" element={
            <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
              <OrderDetailsPage />
            </ProtectedRoute>
          } />

          <Route path="/room-booking" element={<RoomsDashboard />} />
          <Route path="/booking/:roomId" element={<BookingPage />} />
          <Route path="/reviews/:roomId" element={<ReviewsPage />} />

          {/* OWNER */}
          <Route path="/vendor/boarding/dashboard" element={<OwnerDashboard />} />
          <Route path="/roomlisting" element={<RoomListing />} />
          <Route path="/manage-rooms" element={<ManageRooms />} />
          <Route path="/booking-requests" element={<BookingRequest />} />
          <Route path="/reviews-maintenance" element={<ReviewMaintenance />} />

          {/* VENDOR */}
          <Route path="/vendor/food/dashboard" element={
            <ProtectedRoute allowedRoles={['vendor']} allowedVendorTypes={['food']}>
              <FoodVendorDashboard />
            </ProtectedRoute>
          } />

          {/* ✅ FIXED: Item Management Route */}
          <Route 
            path="/ItemManagement" 
            element={
              <ProtectedRoute allowedRoles={['vendor']} allowedVendorTypes={['food']}>
                <FoodVendor />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/addItem" 
            element={
              <ProtectedRoute allowedRoles={['vendor']} allowedVendorTypes={['food']}>
                <AddItem />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/updateItem/:id" 
            element={
              <ProtectedRoute allowedRoles={['vendor']} allowedVendorTypes={['food']}>
                <UpdateItem />
              </ProtectedRoute>
            } 
          />

           <Route 
            path="/accept-item" 
            element={
              <ProtectedRoute allowedRoles={['vendor']} allowedVendorTypes={['food']}>
                <AcceptItem />
              </ProtectedRoute>
              } 
          />

              <Route 
                path="/complaint" 
              element={
                <ProtectedRoute allowedRoles={['vendor']} allowedVendorTypes={['food']}>
                  <Complaint />
                </ProtectedRoute>
              } 
            />

          {/* Admin */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard defaultTab="users" />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/payments" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard defaultTab="payments" />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/subscriptions" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard defaultTab="subscriptions" />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/tickets" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard defaultTab="tickets" />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/tickets/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard defaultTab="ticket-details" />
              </ProtectedRoute>
            } 
          />

        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;