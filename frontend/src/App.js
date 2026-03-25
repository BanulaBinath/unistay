import React from "react";
import './App.css';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

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

import StudentDashboard from './Components/dashboards/StudentDashboard';
import FoodVendorDashboard from './Components/dashboards/FoodVendorDashboard';
import BoardingVendorDashboard from './Components/dashboards/BoardingVendorDashboard';
import LaundryVendorDashboard from './Components/dashboards/LaundryVendorDashboard';
import CleaningVendorDashboard from './Components/dashboards/CleaningVendorDashboard';

import AdminDashboard from './Components/admin/AdminDashboard';
import UsersManagement from './Components/admin/UsersManagement';
import PaymentsManagement from './Components/admin/PaymentsManagement';
import SubscriptionsManagement from './Components/admin/SubscriptionsManagement';

import CreateComplaintPage from './pages/student/CreateComplaintPage';
import MyTicketsPage from './pages/student/MyTicketsPage';
import TicketDetailsPage from './pages/student/TicketDetailsPage';

import AdminTicketsPage from './pages/admin/AdminTicketsPage';
import AdminTicketDetailsPage from './pages/admin/AdminTicketDetailsPage';

import FoodVendor from './Components/foodvendor/foodvendor';
import AddItem from './Components/foodvendor/addItem';
import UpdateItem from './Components/foodvendor/updateitem';
import AcceptItem from './Components/foodvendor/AcceptItem';
import Complaint from './Components/foodvendor/foodVendorcomplaint';
import BuyOrderPage from './Components/studenthome/foodorder';

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

          <Route 
            path="/student/complaints/new" 
            element={
              <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
                <CreateComplaintPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/student/complaints" 
            element={
              <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
                <MyTicketsPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/student/complaints/:id" 
            element={
              <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
                <TicketDetailsPage />
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

          <Route 
            path="/vendor/boarding/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['vendor']} allowedVendorTypes={['boarding']}>
                <BoardingVendorDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/vendor/laundry/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['vendor']} allowedVendorTypes={['laundry']}>
                <LaundryVendorDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/vendor/cleaning/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['vendor']} allowedVendorTypes={['cleaning']}>
                <CleaningVendorDashboard />
              </ProtectedRoute>
            } 
          />

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
                <UsersManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/payments" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PaymentsManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/subscriptions" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SubscriptionsManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/tickets" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminTicketsPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/tickets/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminTicketDetailsPage />
              </ProtectedRoute>
            } 
          />

        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;