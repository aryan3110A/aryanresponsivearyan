"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/database/firebase";
import { APP_ROUTES } from "../../routes/routes"
import { startSessionMonitoring, validateCurrentSession } from "./sessionManager"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let unsubscribeSession: (() => void) | null = null;
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push(APP_ROUTES.SIGNUP)
      } else {
        const email = user.email
        if (email) {
          // Validate current session
          const isValidSession = await validateCurrentSession(email)
          
          if (isValidSession) {
            setAuthenticated(true)
            // Start monitoring for session changes
            unsubscribeSession = startSessionMonitoring(email)
          } else {
            // Invalid session, redirect to login
            router.push(APP_ROUTES.SIGNUP)
          }
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubscribeSession) {
        unsubscribeSession();
      }
    };
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
