// src/features/auth/pages/LoginPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm'; // Adjust the import path as needed
import {
  loginUser,
  selectIsLoggedIn,
  selectAuthIsLoading,
  selectAuthError,
  clearAuthError
} from '../../features/auth/authSlice'; // Adjust the import path as needed
// We don't need FaTools anymore if we're using the image logo

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectAuthIsLoading);
  const authError = useSelector(selectAuthError);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (isLoggedIn) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, location.state]);

  useEffect(() => {
    dispatch(clearAuthError());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleLoginSubmit = async (credentials) => {
    dispatch(loginUser(credentials));
  };

  // Define logo path - assumes logo.png is in public/assets/
  const logoUrl = '/assets/logo.png'; 

  return (
    // Using DaisyUI's data-theme="dark" on html tag handles the overall dark theme
    // bg-base-200 provides a slightly lighter dark background for the page itself
    <div className="flex items-center justify-center min-h-screen bg-base-200 px-4 py-12 sm:px-6 lg:px-8 text-base-content">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          {/* Updated Logo Section */}
          <div className="mb-6">
            <img src={logoUrl} alt="Company Logo" className="h-20 w-auto" /> {/* Adjust height (h-20) as needed */}
          </div>

          <h1 className="card-title text-3xl !mb-1 text-primary">Company System</h1>
          <p className="mt-0 text-sm text-base-content/70">Machine & Tool Management</p>

          <LoginForm
            onSubmit={handleLoginSubmit}
            isLoading={isLoading}
            serverError={authError}
          />

          <div className="mt-8 pt-6 border-t border-base-300 text-center w-full">
            <p className="text-xs text-base-content/60">
              &copy; {currentYear} Your Company Name. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;