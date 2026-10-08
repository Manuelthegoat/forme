import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import { supabase } from "../lib/supabase";

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);
  // remembers which user the admin check result belongs to
  const [adminCheck, setAdminCheck] = useState({ userId: null, isAdmin: false });

  // 1. keep the session in sync
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // 2. whenever the user changes, ask the database if they're an admin
  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    supabase.rpc("is_admin").then(({ data, error }) => {
      if (cancelled) return;
      setAdminCheck({ userId, isAdmin: !error && data === true });
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const checking = Boolean(userId) && adminCheck.userId !== userId;
  const loading = !sessionReady || checking;
  const isAdmin = Boolean(userId) && adminCheck.userId === userId && adminCheck.isAdmin;

  const signIn = useCallback(
    (email, password) => supabase.auth.signInWithPassword({ email, password }),
    []
  );
  const signOut = useCallback(() => supabase.auth.signOut(), []);

  const value = useMemo(
    () => ({ user: session?.user ?? null, isAdmin, loading, signIn, signOut }),
    [session, isAdmin, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}