// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { FaTachometerAlt, FaUsersCog, FaHardHat, FaTools as FaToolsIcon, FaCogs, FaSignOutAlt, FaClipboardList, FaTruckLoading, FaBoxOpen } from 'react-icons/fa';
import { MdHandyman, MdSettings, MdOutlineAdminPanelSettings } from 'react-icons/md';

const navIcons = { /* ... same icon definitions as before ... */ 
    dashboard: <FaTachometerAlt />,
    machines: <FaHardHat />,
    tools: <FaToolsIcon />,
    requests: <FaTruckLoading />,
    employees: <FaUsersCog />,
    machineElements: <FaCogs />, // For Admin - Manage Machine Elements
    toolElements: <MdHandyman />,   // For Admin - Manage Tool Elements
    settings: <MdSettings />,     // For Admin - System Settings
    purchaseOrders: <FaClipboardList />, // For PO
    toolInventoryPO: <FaBoxOpen/>, 
    machineInventoryQS: <FaHardHat/>, 
    toolInventoryQS: <FaBoxOpen/>, 
    toolsByLaborQS: <FaUsersCog/>, 
    adminDashboard: <MdOutlineAdminPanelSettings/>,
};

// The `isOpen` prop is no longer needed from drawer parent for visibility,
// but can be used if you want to change content *inside* the sidebar based on state
// (e.g. show only icons when "collapsed" on desktop).
// For DaisyUI drawer, it handles the open/close via checkbox and CSS for responsiveness.
function Sidebar({ onLogout }) { 
  const currentUser = useSelector(selectCurrentUser);
  const userRole = currentUser?.role;

  let navigationItems = [];
  let sidebarHeader = "Menu"; // Default header

  // Define navigation based on role
    if (userRole === 'supervisor') {
        sidebarHeader = "Supervisor Menu";
        navigationItems = [
          { label: "Dashboard", path: "/dashboard/supervisor", icon: navIcons.dashboard, exact: true },
          { label: "Machines", path: "/dashboard/supervisor/machines", icon: navIcons.machines },
          { label: "Tools", path: "/dashboard/supervisor/tools", icon: navIcons.tools },
          { label: "Transfer Requests", path: "/dashboard/supervisor/requests", icon: navIcons.requests },
        ];
      } else if (userRole === 'qs_accountant_md') {
        sidebarHeader = "QS/Acc/MD Menu";
        navigationItems = [
          { label: "Dashboard", path: "/dashboard/qs", icon: navIcons.dashboard, exact: true },
          { label: "Machine Inventory", path: "/dashboard/qs/machine-inventory", icon: navIcons.machineInventoryQS },
          { label: "Tool Inventory", path: "/dashboard/qs/tool-inventory", icon: navIcons.toolInventoryQS },
          { label: "Tools by Labor", path: "/dashboard/qs/tools-by-labor", icon: navIcons.toolsByLaborQS },
        ];
      } else if (userRole === 'purchase_officer') {
        sidebarHeader = "Purchase Officer Menu";
        navigationItems = [
          { label: "Dashboard", path: "/dashboard/po", icon: navIcons.dashboard, exact: true },
          { label: "Tool Inventory", path: "/dashboard/po/tool-inventory", icon: navIcons.toolInventoryPO },
          { label: "Purchase Orders", path: "/dashboard/po/purchase-orders", icon: navIcons.purchaseOrders },
        ];
      } else if (userRole === 'admin') {
        sidebarHeader = "Administrator Menu";
        navigationItems = [
          { label: "Admin Dashboard", path: "/dashboard/admin", icon: navIcons.adminDashboard, exact: true },
          { label: "Manage Employees", path: "/dashboard/admin/employees", icon: navIcons.employees },
          { label: "Machine Elements", path: "/dashboard/admin/machine-elements", icon: navIcons.machineElements },
          { label: "Tool Elements", path: "/dashboard/admin/tool-elements", icon: navIcons.toolElements },
          { label: "System Settings", path: "/dashboard/admin/settings", icon: navIcons.settings },
        ];
      }
  
  const logoUrl = '/assets/logo.png';

  return (
    // DaisyUI drawer-side content. `menu` class for DaisyUI menu styling.
    // `p-4 w-64` for padding and fixed width. `bg-base-100` for background.
    // `h-full` ensures it takes the full height of the drawer side.
    <ul className="menu p-4 w-64 min-h-full bg-base-100 text-base-content">
      {/* Sidebar content here */}
      <li className="menu-title mb-2 flex items-center gap-2 px-0">
        <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
        <span className="font-semibold text-lg text-primary">Company</span>
      </li>
      {currentUser && (
          <li className="menu-title text-xs px-0">
            <span>{currentUser.displayName || currentUser.username} ({currentUser.role})</span>
          </li>
      )}

      {navigationItems.map((item) => (
        <li key={item.label}>
          <NavLink
            to={item.path}
            // end={item.exact} // Use `end` for exact matching on index/parent routes
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg text-md
               ${isActive ? 'active bg-primary text-primary-content font-semibold' : 'hover:bg-base-300'}`
            }
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        </li>
      ))}
      
      {/* Logout Button at the bottom */}
      <li className="mt-auto">
        <button
          onClick={onLogout}
          className="btn btn-error btn-block mt-4"
        >
          <FaSignOutAlt className="mr-2" />
          Log Out
        </button>
      </li>
    </ul>
  );
}

export default Sidebar;