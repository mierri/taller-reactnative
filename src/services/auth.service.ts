import { apiRequest } from './api';

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
  role: 'ADMIN' | 'DIRECTOR' | 'SERVICE_ADVISOR' | 'TECHNICIAN';
  effectivePermissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/**
 * Endpoint real: POST /api/v1/auth/login
 */
export async function loginRequest(credentials: LoginDto): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

