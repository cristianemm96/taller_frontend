export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');

  // 1. Creamos las cabeceras usando la clase nativa Headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // 3. Adjuntamos el token si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 4. Ejecutamos fetch con las cabeceras unificadas y sin errores de tipo
  return fetch(url, {
    ...options,
    headers,
  });
};