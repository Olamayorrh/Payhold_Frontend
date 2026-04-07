import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Landing from './pages/Landing/Landing.jsx';
import Login from './pages/Auth/Login.jsx';
import Signup from './pages/Auth/Signup.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import CreateEscrow from './pages/Escrow/CreateEscrow.jsx';
import EscrowList from './pages/Escrow/EscrowList.jsx';
import PaymentLinkPage from './pages/Escrow/PaymentLinkPage.jsx';
import PaymentVerify from './pages/Escrow/PaymentVerify.jsx';
import KYCVerification from './pages/KYC/KYCVerification.jsx';
import Wallet from './pages/Wallet/Wallet.jsx';
import Profile from './pages/Profile/Profile.jsx';
import Payout from './pages/Payout/Payout.jsx';
import MainLayout from './components/Layout/MainLayout/MainLayout.jsx';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <MainLayout>{children}</MainLayout>;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Public Payment Flow */}
          <Route path="/p/:code" element={<PaymentLinkPage />} />
          <Route path="/pay/verify" element={<PaymentVerify />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/create-escrow" element={
            <ProtectedRoute>
              <CreateEscrow />
            </ProtectedRoute>
          } />

          <Route path="/escrows" element={
            <ProtectedRoute>
              <EscrowList />
            </ProtectedRoute>
          } />

          <Route path="/wallet" element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/kyc" element={
            <ProtectedRoute>
              <KYCVerification />
            </ProtectedRoute>
          } />

          <Route path="/payout" element={
            <ProtectedRoute>
              <Payout />
            </ProtectedRoute>
          } />
          
          {/* Default Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
