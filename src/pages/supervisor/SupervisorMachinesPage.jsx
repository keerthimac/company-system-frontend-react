// src/pages/supervisor/SupervisorMachinesPage.jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SupervisorMachinesPage = () => {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl text-primary">Machine Management (Supervisor)</h2>
        {action && (
          <div className="alert alert-info shadow-lg mt-4">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Action requested: <strong>{action}</strong>. UI for this will be here.</span>
            </div>
          </div>
        )}
        <p className="mt-4">Table of machines, filters, and action buttons (e.g., for Assign Machine, Request Transfer) will be displayed here.</p>
      </div>
    </div>
  );
};

export default SupervisorMachinesPage;