// src/features/auth/components/LoginForm.jsx
import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa'; // Using FaSpinner for loading

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
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* Display server-side errors or form validation errors */}
      {(serverError || formError) && (
        <div role="alert" className="alert alert-error shadow-lg text-sm p-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m0 0l-2-2m0 0l-2 2m2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{serverError || formError}</span>
        </div>
      )}

      <div className="rounded-md shadow-sm">
        <div className="form-control w-full"> {/* DaisyUI form-control for structure */}
          <label className="label sr-only" htmlFor="username-input">
            <span className="label-text">Email address or Username</span>
          </label>
          <input
            id="username-input"
            type="text"
            placeholder="Email address or Username"
            className="input input-bordered w-full rounded-t-md rounded-b-none focus:z-10" // DaisyUI input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-control w-full -mt-px"> {/* Negative margin to connect inputs */}
          <label className="label sr-only" htmlFor="password-input">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password-input"
            type="password"
            placeholder="Password"
            className="input input-bordered w-full rounded-b-md rounded-t-none focus:z-10" // DaisyUI input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="form-control">
          <label className="label cursor-pointer py-0">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="checkbox checkbox-primary checkbox-sm mr-2" // DaisyUI checkbox
            />
            <span className="label-text text-base-content/80">Remember me</span>
          </label>
        </div>
        <div className="text-sm">
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Forgot password clicked!'); }} className="link link-primary text-sm"> {/* DaisyUI link */}
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full group relative" // DaisyUI button
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