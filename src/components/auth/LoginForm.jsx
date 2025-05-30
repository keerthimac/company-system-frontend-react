// src/features/auth/components/LoginForm.jsx
import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

// Define a custom blue color matching your logo, or use DaisyUI's primary if themed correctly
const logoBlue = "#4A6A9E"; // Approximated from your logo
const logoBlueDarker = "#3e5a8a"; // A slightly darker version for hover

function LoginForm({ onSubmit, isLoading, serverError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setFormError('Please enter both username and password.');
      return;
    }
    setFormError('');
    onSubmit({ username, password, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6 w-full"> {/* Added w-full */}
      {(serverError || formError) && (
        <div role="alert" className="alert alert-error shadow-lg text-sm p-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m0 0l-2-2m0 0l-2 2m2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{serverError || formError}</span>
        </div>
      )}

      <div className="rounded-md shadow-sm">
        <div className="form-control w-full">
          <label className="label sr-only" htmlFor="username-input">
            <span className="label-text">Email address or Username</span>
          </label>
          <input
            id="username-input"
            type="text"
            placeholder="Email address or Username"
            // Using DaisyUI input with primary focus, or use custom border color
            className="input input-bordered w-full rounded-t-md rounded-b-none focus:z-10 focus:border-primary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-control w-full -mt-px">
          <label className="label sr-only" htmlFor="password-input">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password-input"
            type="password"
            placeholder="Password"
            className="input input-bordered w-full rounded-b-md rounded-t-none focus:z-10 focus:border-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Adjusted spacing for "Remember me" and "Forgot password" */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 mt-4 mb-2"> {/* Added mt-4 mb-2 for overall spacing */}
        <div className="form-control">
          <label className="label cursor-pointer py-0">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="checkbox checkbox-sm mr-2 border-slate-500 checked:checkbox-primary" // DaisyUI checkbox, ensure primary matches logo blue
            />
            <span className="label-text text-sm text-base-content/80">Remember me</span>
          </label>
        </div>
        <div className="text-sm">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); alert('Forgot password clicked!'); }} 
            // Use DaisyUI's link-primary or style={{ color: logoBlue }} for custom color
            className="link link-hover text-sm"
            style={{ color: logoBlue }} 
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn w-full group relative text-white" // DaisyUI button, removed btn-primary to use custom style
          style={{ backgroundColor: isLoading ? logoBlueDarker : logoBlue, borderColor: logoBlue }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = logoBlueDarker}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = isLoading ? logoBlueDarker : logoBlue }
        >
          {isLoading && (
            <FaSpinner className="animate-spin mr-2" />
          )}
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;