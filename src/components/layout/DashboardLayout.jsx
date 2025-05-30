// src/components/layout/DashboardLayout.jsx
import React from 'react'; // Removed useState, useEffect as drawer handles responsiveness
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import { logoutUser, selectCurrentUser } from '../../features/auth/authSlice';

function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login');
    });
  };

  // The drawer's open/close state is handled by the checkbox with id="my-drawer-3"
  // The Header will have a button to toggle this checkbox for mobile

  return (
    <div className="drawer lg:drawer-open"> {/* DaisyUI: lg:drawer-open makes it static on large screens */}
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-200"> {/* Main content area */}
        {/* Header: Pass a function to toggle the drawer */}
        <Header 
          userName={currentUser?.displayName || currentUser?.username}
          onToggleSidebar={() => {
            const checkbox = document.getElementById('my-drawer-3');
            if (checkbox) checkbox.checked = !checkbox.checked;
          }}
        />
        
        {/* Page content here with padding and scroll */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet /> {/* This is where matched child routes will render */}
        </main>
      </div>
      <div className="drawer-side z-40"> {/* Sidebar, z-40 to be above content on mobile */}
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        {/* Sidebar component is rendered here. It doesn't need to manage its own open/close visibility anymore. */}
        <Sidebar onLogout={handleLogout} />
      </div>
    </div>
  );
}

export default DashboardLayout;