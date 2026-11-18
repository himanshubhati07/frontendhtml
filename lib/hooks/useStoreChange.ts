"use client";

import { useEffect, useRef } from "react";
import { STORE_EVENT } from "@/lib/stores/storage";

// Runs the callback whenever any localStorage-backed store mutates.
export function useStoreChange(callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handler = () => callbackRef.current();
    window.addEventListener(STORE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
}
