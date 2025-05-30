// src/App.jsx
import React from "react"; // Removed useState, useEffect if not directly used here anymore
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "./features/auth/authSlice";

import LoginPage from "./pages/auth/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout"; // Import the real layout
import SupervisorMainDashboardPage from './pages/supervisor/SupervisorMainDashboardPage';

// Placeholder components for child routes (WE WILL CREATE THESE LATER)
// const SupervisorMainDashboardPage = () => (
//   <div className="p-4 rounded-box bg-base-100 shadow">
//     <h2 className="text-xl font-semibold">Supervisor Main Dashboard</h2>
//     <p>Widgets and quick links go here.</p>
//   </div>
// );
const SupervisorMachinesPage = () => (
  <div className="p-4 rounded-box bg-base-100 shadow">
    <h2 className="text-xl font-semibold">Supervisor Machines List</h2>
    <p>Table of machines goes here.</p>
  </div>
);
const SupervisorToolsPage = () => (
  <div className="p-4 rounded-box bg-base-100 shadow">
    <h2 className="text-xl font-semibold">Supervisor Tools List</h2>
    <p>Table of tools goes here.</p>
  </div>
);
const SupervisorRequestsPage = () => (
  <div className="p-4 rounded-box bg-base-100 shadow">
    <h2 className="text-xl font-semibold">Supervisor Transfer Requests</h2>
    <p>List of requests goes here.</p>
  </div>
);

// Placeholders for other roles (QS, PO, Admin)
const QsDashboardPage = () => (
  <div className="p-4 rounded-box bg-base-100 shadow">
    <h2 className="text-xl font-semibold">QS/Accountant/MD Dashboard</h2>
  </div>
);
const PoDashboardPage = () => (
  <div className="p-4 rounded-box bg-base-100 shadow">
    <h2 className="text-xl font-semibold">Purchase Officer Dashboard</h2>
  </div>
);
const AdminDashboardPage = () => (
  <div className="p-4 rounded-box bg-base-100 shadow">
    <h2 className="text-xl font-semibold">Admin Dashboard</h2>
  </div>
);

const ProtectedRoute = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  // DashboardLayout will now contain the <Outlet /> for its children
  return <DashboardLayout />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute />}>
        {/* Child routes for Supervisor */}
        <Route path="supervisor" element={<Outlet />}>
          {" "}
          {/* Parent route for all supervisor views */}
          <Route index element={<SupervisorMainDashboardPage />} />{" "}
          {/* Default for /dashboard/supervisor */}
          <Route path="machines" element={<SupervisorMachinesPage />} />
          <Route path="tools" element={<SupervisorToolsPage />} />
          <Route path="requests" element={<SupervisorRequestsPage />} />
        </Route>

        {/* Placeholder child routes for other roles (add actual components later) */}
        <Route path="qs" element={<Outlet />}>
          <Route index element={<QsDashboardPage />} />
          {/* <Route path="machine-inventory" element={<QsMachineInventoryPage />} /> */}
        </Route>
        <Route path="po" element={<Outlet />}>
          <Route index element={<PoDashboardPage />} />
          {/* <Route path="tool-inventory" element={<PoToolInventoryPage />} /> */}
        </Route>
        <Route path="admin" element={<Outlet />}>
          <Route index element={<AdminDashboardPage />} />
          {/* <Route path="employees" element={<AdminEmployeesPage />} /> */}
        </Route>

        {/* A default redirect if /dashboard is hit without a specific role path,
            could be smarter based on logged-in user's role */}
        <Route index element={<Navigate to="supervisor" replace />} />
      </Route>

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
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center min-h-screen text-base-content">
            <h1 className="text-2xl">404 - Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
