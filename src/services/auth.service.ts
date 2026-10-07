import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "./api";

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  workshopId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "DIRECTOR" | "SERVICE_ADVISOR" | "TECHNICIAN";
  effectivePermissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const TOKEN_KEY = "@pitstop_access_token";
export const REFRESH_TOKEN_KEY = "@pitstop_refresh_token";

export async function loginRequest(
  credentials: LoginDto,
): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (data?.accessToken) {
    await AsyncStorage.setItem(TOKEN_KEY, data.accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  }

  return data;
}
