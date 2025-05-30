// src/components/layout/Header.jsx
import React from 'react';
import { FaBell, FaUserCircle, FaBars } from 'react-icons/fa';

// onToggleSidebar is now a function to toggle the main drawer checkbox
function Header({ onToggleSidebar, userName }) {
  return (
    <header className="navbar bg-base-100 shadow-sm px-4 sticky top-0 z-30 h-16 min-h-16"> {/* Fixed height, shadow-sm */}
      <div className="flex-none lg:hidden"> {/* Button to toggle drawer on small screens */}
        <button 
          className="btn btn-square btn-ghost"
          onClick={onToggleSidebar} // This will toggle the drawer checkbox
          aria-label="Open sidebar"
        >
          <FaBars className="text-xl" />
        </button>
      </div>
      <div className="flex-1 px-2 mx-2">
        {/* Optionally, you can have a title here that changes based on the route */}
        <span className="text-xl font-semibold text-primary hidden sm:inline">
          Company System
        </span>
      </div>
      <div className="flex-none gap-2">
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <FaBell className="text-xl" />
            <span className="badge badge-xs badge-secondary indicator-item"></span> {/* Changed to secondary for contrast */}
          </div>
        </button>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
              <FaUserCircle className="w-full h-full text-primary" />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
            <li className="menu-title px-4 py-2"><span>{userName || 'User Menu'}</span></li>
            <li><a className="justify-between">Profile</a></li>
            <li><a>Settings</a></li>
            {/* Logout button is now in the Sidebar component directly */}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;