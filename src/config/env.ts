export const CONFIG = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.149:3000/api/v1',
  useMocks: process.env.EXPO_PUBLIC_USE_MOCKS !== 'false',
};

