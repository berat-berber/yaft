const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(API_BASE_URL+ "/api" + endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized - redirecting to login');
  }

  return response;
}

export async function fetchWithoutAuth(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(API_BASE_URL+ "/api" + endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response;
}