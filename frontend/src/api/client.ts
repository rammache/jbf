export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;
  readonly isUnauthorized: boolean;
  readonly isForbidden: boolean;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.isUnauthorized = status === 401;
    this.isForbidden = status === 403;
  }
}

export interface ApiFetchOptions extends RequestInit {
  json?: unknown;
  skipAuthHandlers?: boolean;
}

export type ApiErrorHandler = (
  error: ApiError,
  context: { endpoint: string; options: ApiFetchOptions }
) => void;

const TOKEN_STORAGE_KEY = "jabour_admin_token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

let onUnauthorizedHandler: ApiErrorHandler | null = null;
let onForbiddenHandler: ApiErrorHandler | null = null;

export function setUnauthorizedHandler(handler: ApiErrorHandler | null): void {
  onUnauthorizedHandler = handler;
}

export function setForbiddenHandler(handler: ApiErrorHandler | null): void {
  onForbiddenHandler = handler;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { json, skipAuthHandlers = false, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let body = fetchOptions.body;
  if (json !== undefined) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    body = JSON.stringify(json);
  } else if (
    body &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof ArrayBuffer)
  ) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    body = JSON.stringify(body);
  }

  const baseUrl = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) || "";
  const requestUrl = endpoint.startsWith("http://") || endpoint.startsWith("https://")
    ? endpoint
    : `${baseUrl}${endpoint}`;

  const response = await fetch(requestUrl, {
    credentials: baseUrl ? "include" : "same-origin",
    ...fetchOptions,
    headers,
    body
  });

  if (!response.ok) {
    let errorData: unknown = null;
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const parsed = (await response.json()) as {
          error?: string;
          message?: string;
        } | null;
        errorData = parsed;
        if (parsed?.error && typeof parsed.error === "string") {
          errorMessage = parsed.error;
        } else if (parsed?.message && typeof parsed.message === "string") {
          errorMessage = parsed.message;
        }
      } else {
        const text = await response.text();
        if (text) {
          errorMessage = text;
        }
      }
    } catch {
      // response body could not be parsed; keep default status message
    }

    const apiError = new ApiError(errorMessage, response.status, errorData);

    if (!skipAuthHandlers) {
      if (response.status === 401 && onUnauthorizedHandler) {
        onUnauthorizedHandler(apiError, { endpoint, options });
      } else if (response.status === 403 && onForbiddenHandler) {
        onForbiddenHandler(apiError, { endpoint, options });
      }
    }

    throw apiError;
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}

export const api = {
  get: <T = unknown>(endpoint: string, options?: ApiFetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: ApiFetchOptions
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      ...(data !== undefined
        ? typeof data === "object" && !(data instanceof FormData)
          ? { json: data }
          : { body: data as BodyInit }
        : {})
    }),

  put: <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: ApiFetchOptions
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      ...(data !== undefined
        ? typeof data === "object" && !(data instanceof FormData)
          ? { json: data }
          : { body: data as BodyInit }
        : {})
    }),

  delete: <T = unknown>(endpoint: string, options?: ApiFetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" })
};
