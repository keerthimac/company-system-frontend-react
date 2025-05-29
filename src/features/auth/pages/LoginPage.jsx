// src/features/auth/pages/LoginPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm'; // Adjusted path
import {
  loginUser,
  selectIsLoggedIn,
  selectAuthIsLoading,
  selectAuthError,
  clearAuthError
} from '../authSlice'; // Assuming authSlice.js is in the same folder
import { FaTools } from 'react-icons/fa'; // Using FaTools from React Icons

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectAuthIsLoading);
  const authError = useSelector(selectAuthError);

  const currentYear = new Date().getFullYear();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, location.state]);

  // Clear auth error when the component unmounts or when a new login attempt starts
  useEffect(() => {
    dispatch(clearAuthError()); // Clear error on component load
    return () => {
      dispatch(clearAuthError()); // Clear error on component unmount
    };
  }, [dispatch]);

  const handleLoginSubmit = async (credentials) => {
    // credentials will be { username, password, rememberMe }
    dispatch(loginUser(credentials));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 px-4 py-12 sm:px-6 lg:px-8 text-base-content">
      <div className="card w-full max-w-md bg-base-100 shadow-xl"> {/* DaisyUI card */}
        <div className="card-body items-center text-center">
          <div className="avatar placeholder mb-4"> {/* DaisyUI avatar placeholder */}
            <div className="bg-primary text-primary-content rounded-full w-16 h-16 ring ring-primary ring-offset-base-100 ring-offset-2">
              <FaTools className="text-3xl" />
            </div>
          </div>
          <h1 className="card-title text-3xl !mb-0 text-primary">Company System</h1> {/* DaisyUI card-title */}
          <p className="mt-1 text-sm text-base-content/70">Machine & Tool Management</p>

          <LoginForm 
            onSubmit={handleLoginSubmit} 
            isLoading={isLoading}
            serverError={authError} // Pass the authError from Redux to LoginForm
          />

          <div className="mt-6 pt-6 border-t border-base-300 text-center w-full">
            <p className="text-xs text-base-content/60">
              &copy; {currentYear} Company Name. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;