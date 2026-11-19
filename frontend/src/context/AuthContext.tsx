import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { AdminUser } from "../types";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

interface AuthContextValue {
  admin: AdminUser | null;
  status: AuthStatus;
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

  const signIn = useCallback((nextAdmin: AdminUser) => {
    setAdmin(nextAdmin);
    setStatus("authenticated");
  }, []);

  const signOut = useCallback(() => {
    setAdmin(null);
    setStatus("unauthenticated");
  }, []);

  const refresh = useCallback(async () => {
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/me", {
        credentials: "same-origin",
        headers: { Accept: "application/json" }
      });

      if (res.status === 401 || res.status === 403) {
        setAdmin(null);
        setStatus("unauthenticated");
        return;
      }

      if (!res.ok) {
        setStatus("error");
        return;
      }

      const body = (await res.json().catch(() => null)) as {
        success?: boolean;
        data?: unknown;
      } | null;

      if (body?.success && isAdminUser(body.data)) {
        setAdmin(body.data);
        setStatus("authenticated");
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({ admin, status, signIn, signOut, refresh }),
    [admin, status, signIn, signOut, refresh]
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
