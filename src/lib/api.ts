const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.gknetsolutions.co.uk/api';

export async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

  const headers = new Headers(options?.headers);
  if (options?.body && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // ignore JSON parse error for text/html error responses
    }
    throw new Error(errorMessage);
  }

  // If response is empty (e.g. 204 No Content), return empty object/null
  if (response.status === 204) {
    return null as unknown as T;
  }

  return response.json() as Promise<T>;
}
