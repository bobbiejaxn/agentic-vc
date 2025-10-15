"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { DevAuthBypass, DevUser } from "@/lib/auth/dev-bypass";

interface DevAuthContextType {
  currentUser: DevUser | null;
  setCurrentUser: (user: DevUser | null) => void;
  availableUsers: DevUser[];
}

const DevAuthContext = createContext<DevAuthContextType | null>(null);

export function DevAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DevUser | null>(null);
  const [availableUsers] = useState<DevUser[]>(DevAuthBypass.getAllDevUsers());

  // Set default user on mount
  useEffect(() => {
    if (availableUsers.length > 0) {
      setCurrentUser(DevAuthBypass.getDefaultDevUser());
    }
  }, []);

  return (
    <DevAuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers,
      }}
    >
      {children}
    </DevAuthContext.Provider>
  );
}

export function useDevAuth() {
  const context = useContext(DevAuthContext);
  if (!context) {
    throw new Error("useDevAuth must be used within a DevAuthProvider");
  }
  return context;
}

// Hook to add dev user headers to fetch requests
export function useDevAuthHeaders() {
  const { currentUser } = useDevAuth();

  return useMemo(
    () => ({
      "x-dev-user-id": currentUser?.id || "",
    }),
    [currentUser?.id]
  );
}
