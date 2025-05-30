// src/pages/supervisor/SupervisorMainDashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExchangeAlt, FaHardHat, FaTools as FaToolsIcon, FaPlusCircle, FaTasks, FaWrench } from 'react-icons/fa'; // Example icons

const SupervisorMainDashboardPage = () => {
  const widgets = [
    { title: "Pending Transfers", value: "5", color: "bg-warning text-warning-content", icon: <FaExchangeAlt className="w-8 h-8" />, link: "../requests" },
    { title: "Machines to Assign", value: "3", color: "bg-info text-info-content", icon: <FaHardHat className="w-8 h-8" />, link: "../machines" },
    { title: "Tools Assigned Today", value: "17", color: "bg-success text-success-content", icon: <FaToolsIcon className="w-8 h-8" />, link: "../tools" }
  ];

  const quickLinks = [
    { label: "Request New Machine", path: "../machines", query: { action: 'request' }, icon: <FaPlusCircle /> },
    { label: "Assign Machine", path: "../machines", query: { action: 'assign' }, icon: <FaTasks /> },
    { label: "Assign Tool", path: "../tools", query: { action: 'assign' }, icon: <FaWrench /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-base-content mb-1">Supervisor Dashboard</h2>
        <p className="text-base-content/70">Overview of your current tasks and machine/tool status.</p>
      </div>

      {/* Widgets Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget, index) => (
          <Link key={index} to={widget.link || '#'} className={`card shadow-lg hover:shadow-xl transition-shadow duration-300 ${widget.color}`}>
            <div className="card-body flex-row items-center p-6"> {/* Use flex-row for icon and text side by side */}
              <div className="mr-4 p-3 bg-black bg-opacity-20 rounded-full">
                {widget.icon}
              </div>
              <div>
                <h3 className="card-title text-3xl font-bold">{widget.value}</h3>
                <p className="text-sm opacity-90">{widget.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links Section */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-xl text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link 
                key={index} 
                to={{ pathname: link.path, search: link.query ? new URLSearchParams(link.query).toString() : '' }}
                className="btn btn-outline btn-primary flex-col h-auto py-4 sm:flex-row sm:justify-start sm:py-0 sm:h-12" // DaisyUI button, adjusted for content
              >
                <span className="text-xl mb-1 sm:mb-0 sm:mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Placeholder for other content like charts or recent activity */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
            <h3 className="card-title text-xl text-primary mb-4">Recent Activity / Charts</h3>
            <p className="text-base-content/70">
                Further content specific to the Supervisor's main dashboard (e.g., charts, recent assignments) can go here.
                This area could display a list of recently assigned tools, machines needing maintenance based on supervisor reports, etc.
            </p>
            {/* Example of a placeholder for a chart */}
            <div className="mt-4 p-4 bg-base-200 rounded-box text-center">
                <p className="text-lg font-medium">Machine Status Overview Chart (Placeholder)</p>
                <div className="mt-2 h-40 flex items-center justify-center text-base-content/50">
                    Chart will be rendered here
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorMainDashboardPage;