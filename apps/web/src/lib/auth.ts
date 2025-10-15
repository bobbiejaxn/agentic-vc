"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useAuth() {
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.authQueries.getUser);

  return {
    user,
    signIn,
    signOut,
    isLoading: user === undefined,
    isAuthenticated: user !== null,
  };
}
