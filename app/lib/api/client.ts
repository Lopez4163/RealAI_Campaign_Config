/**
 * API Client Helper
 * -----------------
 * Centralized wrapper around `fetch()` for calling internal `/api/*` routes.
 *
 * WHY THIS EXISTS:
 * - Avoid repeating fetch boilerplate (headers, JSON parsing, error handling)
 * - Provide a consistent way to make GET / POST / PUT / DELETE requests
 * - Keep components clean and focused on UI + business logic
 *
 * HOW TO USE:
 *
 *   import { api } from '@/app/lib/api/client';
 *
 *   // POST request (most common)
 *   const data = await api.post('/generate', { userContext });
 *
 *   // GET request with query params
 *   const image = await api.get('/og', {
 *     campaignType: 'audience',
 *     industry: 'consumer-product-goods',
 *   });
 *
 *   // PUT / DELETE
 *   await api.put('/user', { name: 'Nicholas' });
 *   await api.delete('/session');
 *
 * NOTES:
 * - All URLs are automatically prefixed with `/api`
 * - Request bodies are JSON-encoded by default
 * - Responses are parsed as JSON and thrown as Errors on non-2xx responses
 * - This helper is intended for CLIENT-SIDE usage only
 *   (server routes should call business logic directly)
 */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
}

async function request<T>(
  url: string,
  { method = 'GET', body, params, headers }: ApiOptions = {}
): Promise<T> {
  let fullUrl = `/api${url}`;

  // Handle query params for GET
  if (params && Object.keys(params).length > 0) {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();

    fullUrl += `?${qs}`;
  }

  const res = await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `API error (${res.status})`);
  }

  return data as T;
}

export const api = {
  get: <T>(url: string, params?: ApiOptions['params']) =>
    request<T>(url, { method: 'GET', params }),

  post: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: 'POST', body }),

  put: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: 'PUT', body }),

  delete: <T>(url: string) =>
    request<T>(url, { method: 'DELETE' }),
};
