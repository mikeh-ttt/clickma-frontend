const BASE_URL = 'https://clickma-backend.vercel.app/api/clickup';

export async function api<T>(
  endpoint: string,
  token: string,
  options?: FetchOptions
) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      Authorization: token,
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  const json: T = await response.json();

  return json;
}
