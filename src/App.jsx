
import React, { useEffect } from 'react';
    import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
    import { AuthProvider, useAuth } from '@/contexts/AuthContext';
    import MainLayout from '@/layouts/MainLayout';
    import HomePage from '@/pages/HomePage';
    import LoginPage from '@/pages/LoginPage';
    import RegisterPage from '@/pages/RegisterPage';
    import DashboardPage from '@/pages/DashboardPage';
    import SettingsPage from '@/pages/SettingsPage';
    import RequestPage from '@/pages/RequestPage';
    import UpgradePage from '@/pages/UpgradePage';
    import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
    import LearnMorePage from '@/pages/LearnMorePage';
    import DmPage from '@/pages/DmPage';
    import { requestNotificationPermission } from '@/utils/notifications';
    
    const PrivateRoute = ({ children }) => {
      const { currentUser, loading } = useAuth();
    
      useEffect(() => {
        if (!loading && currentUser) {
          requestNotificationPermission();
        }
      }, [currentUser, loading]);
    
      if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading...</div>;
      }
    
      return currentUser ? children : <Navigate to="/login" />;
    };
    
    function App() {
      return (
        <AuthProvider>
          <Router>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/learn-more" element={<LearnMorePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/:username" element={<RequestPage />} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
                <Route path="/upgrade" element={<PrivateRoute><UpgradePage /></PrivateRoute>} />
                <Route path="/payment-success" element={<PrivateRoute><PaymentSuccessPage /></PrivateRoute>} />
                <Route path="/dm" element={<PrivateRoute><DmPage /></PrivateRoute>} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      );
    }
    
    export default App;
