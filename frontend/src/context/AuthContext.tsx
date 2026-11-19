import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  ApiError,
  apiFetch,
  setForbiddenHandler,
  setUnauthorizedHandler
} from "../api";
import type { AdminUser } from "../types";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

interface AuthContextValue {
  admin: AdminUser | null;
  status: AuthStatus;
  forbiddenError: string | null;
  clearForbiddenError: () => void;
  signIn: (admin: AdminUser) => void;
  signOut: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isAdminUser(value: unknown): value is AdminUser {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "number" &&
    typeof record.name === "string" &&
    typeof record.email === "string" &&
    typeof record.role === "string"
  );
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [forbiddenError, setForbiddenError] = useState<string | null>(null);

  const clearForbiddenError = useCallback(() => {
    setForbiddenError(null);
  }, []);

  const signIn = useCallback((nextAdmin: AdminUser) => {
    setAdmin(nextAdmin);
    setStatus("authenticated");
    setForbiddenError(null);
  }, []);

  const signOut = useCallback(() => {
    setAdmin(null);
    setStatus("unauthenticated");
    setForbiddenError(null);
  }, []);

  const refresh = useCallback(async () => {
    setStatus("loading");

    try {
      const body = await apiFetch<{
        success?: boolean;
        data?: unknown;
      }>("/api/auth/me", {
        skipAuthHandlers: true
      });

      if (body?.success && isAdminUser(body.data)) {
        setAdmin(body.data);
        setStatus("authenticated");
        return;
      }

      setAdmin(null);
      setStatus("unauthenticated");
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        setAdmin(null);
        setStatus("unauthenticated");
        return;
      }

      setStatus("error");
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAdmin(null);
      setStatus("unauthenticated");
    });

    setForbiddenHandler((err) => {
      setForbiddenError(err.message || "Admin access required.");
    });

    return () => {
      setUnauthorizedHandler(null);
      setForbiddenHandler(null);
    };
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      admin,
      status,
      forbiddenError,
      clearForbiddenError,
      signIn,
      signOut,
      refresh
    }),
    [admin, status, forbiddenError, clearForbiddenError, signIn, signOut, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

export { isAdminUser };
