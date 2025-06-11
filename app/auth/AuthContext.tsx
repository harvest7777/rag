"use client";
// AuthContext.js
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase/supabase";
import { Session, User } from "@supabase/supabase-js";

const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
} | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for an existing session
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setSession(session);
      setLoading(false);
    };

    getSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      // options: {
      //   redirectTo: window.location.origin,
      // },
    });
    if (error) console.error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, session }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use in components
export const useAuth = () => useContext(AuthContext);
