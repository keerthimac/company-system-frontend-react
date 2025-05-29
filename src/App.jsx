import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from './features/auth/authSlice';

// Pages & Layouts (we'll create these next)
import LoginPage from './features/auth/pages/LoginPage';
// import DashboardLayout from './components/layout/DashboardLayout'; // Placeholder for now

// Placeholder for DashboardLayout and its content for now
const DashboardPlaceholder = () => {
  const user = useSelector(state => state.auth.user); // Get user for display
  return (
    <div className="p-10 min-h-screen bg-base-200 text-base-content">
      <h1 className="text-3xl font-bold text-primary mb-4">Dashboard Placeholder</h1>
      <p>Welcome, {user?.displayName || user?.username || 'User'}!</p>
      <p>Role: {user?.role}</p>
      <p className="mt-4">Full dashboard content will go here.</p>
      {/* Outlet for nested dashboard routes will be inside the actual DashboardLayout */}
    </div>
  );
};


// ProtectedRoute component to guard dashboard access
const ProtectedRoute = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  // return <DashboardLayout />; // When DashboardLayout is ready, use this
  return <DashboardPlaceholder />; // Using placeholder for now
  // The <Outlet /> for child routes will be inside DashboardLayout
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard/*" // Matches /dashboard and any sub-routes
        element={<ProtectedRoute />} 
      />
      {/* Default route: if logged in go to dashboard, else to login */}
      <Route
        path="/"
        element={
          useSelector(selectIsLoggedIn) ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={
        <div className="flex items-center justify-center min-h-screen text-base-content">
          <h1 className="text-2xl">404 - Page Not Found</h1>
        </div>
      } />
    </Routes>
  );
}

export default App;