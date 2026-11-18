"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/stores/auth-store";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Lazy initializer: on the client's first render this runs synchronously,
  // so a real visit is authenticated-or-not from the very first frame.
  const [checked, setChecked] = useState<boolean | null>(() =>
    typeof window !== "undefined" ? isAuthenticated() : null,
  );
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (checked === false) {
      const next = encodeURIComponent(window.location.pathname);
      router.replace(`/login?next=${next}`);
      return;
    }
    if (checked === null) setChecked(isAuthenticated());
  }, [checked, router]);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (checked === true) return <>{children}</>;
  if (checked === false || timedOut) return null;

  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status">
      <span className="sr-only">Loading</span>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary" />
    </div>
  );
}
