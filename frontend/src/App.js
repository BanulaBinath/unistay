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

import StudentDashboard from './Components/dashboards/StudentDashboard';
import FoodVendorDashboard from './Components/dashboards/FoodVendorDashboard';
import BoardingVendorDashboard from './Components/dashboards/BoardingVendorDashboard';
import LaundryVendorDashboard from './Components/laundryvendor/laundryvendor';
import CleaningVendorDashboard from './Components/cleaningvendor/cleaningvendor';


// Siddarth - Maintenance Services
import StudentLaundry from './Components/studenthome/studentlaundry';
import StudentCleaning from './Components/studenthome/studentcleaning';


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<NomalHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterSelection />} />
          <Route path="/register/sliit-student" element={<SLIITStudentRegister />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/register/external-student" element={<ExternalStudentRegister />} />
          <Route path="/register/vendor" element={<VendorRegister />} />
          <Route path="/payment/process" element={<PaymentProcess />} />

          {/* TEMP TEST - Siddarth (Remove before final submission) */}
          <Route path="/test/laundry" element={<StudentLaundry />} />
          <Route path="/test/cleaning" element={<StudentCleaning />} />
          <Route path="/test/laundryvendor" element={<LaundryVendorDashboard />} />
          <Route path="/test/cleaningvendor" element={<CleaningVendorDashboard />} />




          {/* Protected Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Siddarth - Student Maintenance Routes */}
          <Route 
            path="/student/laundry" 
            element={
              <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
                <StudentLaundry />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/student/cleaning" 
            element={
              <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
                <StudentCleaning />
              </ProtectedRoute>
            } 
          />


          {/* Protected Vendor Routes */}
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
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;