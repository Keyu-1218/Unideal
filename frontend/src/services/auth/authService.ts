import api from "../api";
import type { AuthResponse, LoginData, RegisterData } from "./types";



export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("auth/login", data);
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getStoredUser = (): { id: number; email: string } | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
