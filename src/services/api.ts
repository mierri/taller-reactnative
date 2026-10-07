import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '@/config/env';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${CONFIG.apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = await AsyncStorage.getItem('@pitstop_access_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ??
      (response.status === 401
        ? 'No autorizado o sesión expirada'
        : 'Error en la petición al servidor');
    const errorType = data?.error ?? 'SERVER_ERROR';
    throw new ApiError(response.status, errorType, message);
  }

  return data as T;
}
