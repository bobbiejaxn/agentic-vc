"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DevAuthBypass, type DevUser } from "@/lib/auth/dev-bypass";
import type { User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  loading: boolean;
  isDevMode: boolean;
  devUser: DevUser | null;
}

export function useDevAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isDevMode: false,
    devUser: null,
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    const initializeAuth = async () => {
      const isDevMode = process.env.NODE_ENV === "development" || 
                       process.env.NEXT_PUBLIC_DEV_MODE === "true";

      if (isDevMode) {
        // In development mode, check for dev bypass
        const devBypassParam = new URLSearchParams(window.location.search).get("dev_user");
        
        if (devBypassParam && devBypassParam in DevAuthBypass.getAllDevUsers()) {
          // Use development bypass
          const devUser = DevAuthBypass.getDevUser(devBypassParam as keyof typeof DevAuthBypass.getAllDevUsers);
          const mockSupabaseUser = DevAuthBypass.createMockSupabaseUser(devUser!);
          
          setAuthState({
            user: mockSupabaseUser as User,
            loading: false,
            isDevMode: true,
            devUser: devUser!,
          });
          return;
        }

        // Check if we should auto-login with default dev user
        const autoDevLogin = localStorage.getItem("dev_auto_login") === "true";
        if (autoDevLogin) {
          const defaultDevUser = DevAuthBypass.getDefaultDevUser();
          const mockSupabaseUser = DevAuthBypass.createMockSupabaseUser(defaultDevUser);
          
          setAuthState({
            user: mockSupabaseUser as User,
            loading: false,
            isDevMode: true,
            devUser: defaultDevUser,
          });
          return;
        }
      }

      // Normal authentication flow
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Auth error:", error);
        }

        setAuthState({
          user,
          loading: false,
          isDevMode: isDevMode,
          devUser: null,
        });
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState({
          user: null,
          loading: false,
          isDevMode: isDevMode,
          devUser: null,
        });
      }
    };

    initializeAuth();
  }, [supabase.auth]);

  const signInAsDevUser = (devUserKey: keyof typeof DevAuthBypass.getAllDevUsers) => {
    const devUser = DevAuthBypass.getDevUser(devUserKey);
    if (devUser) {
      const mockSupabaseUser = DevAuthBypass.createMockSupabaseUser(devUser);
      setAuthState({
        user: mockSupabaseUser as User,
        loading: false,
        isDevMode: true,
        devUser,
      });
    }
  };

  const enableAutoDevLogin = () => {
    localStorage.setItem("dev_auto_login", "true");
    signInAsDevUser("test");
  };

  const disableAutoDevLogin = () => {
    localStorage.removeItem("dev_auto_login");
    // Refresh the auth state
    window.location.reload();
  };

  const signOut = async () => {
    if (authState.isDevMode && authState.devUser) {
      // Clear dev auth state
      setAuthState({
        user: null,
        loading: false,
        isDevMode: true,
        devUser: null,
      });
    } else {
      // Normal sign out
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        loading: false,
        isDevMode: authState.isDevMode,
        devUser: null,
      });
    }
  };

  return {
    ...authState,
    signInAsDevUser,
    enableAutoDevLogin,
    disableAutoDevLogin,
    signOut,
    availableDevUsers: DevAuthBypass.getAllDevUsers(),
  };
}
