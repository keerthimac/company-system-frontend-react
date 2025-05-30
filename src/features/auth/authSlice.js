// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Mock API (can be moved to src/services/authApi.js later)
const mockAuthAPI = {
  login: async (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "admin@example.com" && password === "password") {
          //const user = { id: 'user123', username: 'admin@example.com', displayName: 'Admin User', role: 'admin' };
          const user = {
            id: "userSup",
            username: "supervisor@example.com",
            displayName: "Supervisor User",
            role: "supervisor",
          }; // CHANGE ROLE HERE
          const token = "mock-redux-jwt-token";
          localStorage.setItem("authToken", token);
          localStorage.setItem("user", JSON.stringify(user));
          resolve({ user, token });
        } else {
          reject({ message: "Invalid username or password." });
        }
      }, 500);
    });
  },
  logout: async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    return new Promise((resolve) => setTimeout(resolve, 200));
  },
  loadUserFromStorage: () => {
    const token = localStorage.getItem("authToken");
    const userJson = localStorage.getItem("user");
    return token && userJson
      ? { token, user: JSON.parse(userJson) }
      : { token: null, user: null };
  },
};

const initialUserAndToken = mockAuthAPI.loadUserFromStorage();

const initialState = {
  user: initialUserAndToken.user,
  token: initialUserAndToken.token,
  isLoggedIn: !!initialUserAndToken.token,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await mockAuthAPI.login(
        credentials.username,
        credentials.password
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await mockAuthAPI.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.error = null;
        state.isLoading = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectAuthIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
