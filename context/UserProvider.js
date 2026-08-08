"use client";

import { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { toast } from "react-toastify";

const UserContext = createContext({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      toast.error(error.message || "Failed to create account.");
      throw error;
    }
    toast.success("Account created successfully! Check your email for confirmation.");
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error(error.message || "Invalid credentials.");
      throw error;
    }
    toast.success("Successfully logged in! Welcome back.");
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message || "Failed to sign out.");
      throw error;
    }
    toast.info("Signed out successfully.");
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
