import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import * as authService from "../../services/auth/authService";
import type {
  AuthResponse,
  LoginData,
  RegisterData,
} from "@/services/auth/types";

interface AuthState {
  user: { id: number; email: string } | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: authService.getStoredUser(),
  token: authService.getStoredToken(),
  isLoading: false,
  error: null,
};

// thunks

export const registerUser = createAsyncThunk<AuthResponse, RegisterData>(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Registration failed";
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk<AuthResponse, LoginData>(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Login failed";
      return rejectWithValue(message);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      authService.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, { payload }: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.user = payload.user;
          state.token = payload.token;

          localStorage.setItem("token", payload.token);
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
      )
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, { payload }: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.user = payload.user;
          state.token = payload.token;

          localStorage.setItem("token", payload.token);
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
      )
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
