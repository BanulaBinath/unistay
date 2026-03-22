import React from "react";
import './App.css';
import { Routes, Route } from "react-router-dom";

import NomalHome from './Components/Home/nomalhome';
import Login from './Components/Home/login';
import RegisterSelection from './Components/Home/RegisterSelection';
import SLIITStudentRegister from './Components/Home/SLIITStudentRegister';
import OTPVerification from './Components/Home/OTPVerification';
import ExternalStudentRegister from './Components/Home/ExternalStudentRegister';
import VendorRegister from './Components/Home/VendorRegister';
import PaymentProcess from './Components/Home/PaymentProcess';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<NomalHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterSelection />} />
        <Route path="/register/sliit-student" element={<SLIITStudentRegister />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/register/external-student" element={<ExternalStudentRegister />} />
        <Route path="/register/vendor" element={<VendorRegister />} />
        <Route path="/payment/process" element={<PaymentProcess />} />
      </Routes>
    </div>
  );
}

export default App;