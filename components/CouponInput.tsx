"use client";

import { useState } from "react";
import * as couponStore from "@/lib/stores/coupon-store";
import type { Coupon } from "@/types";

interface CouponInputProps {
  subtotal: number;
  applied: Coupon | null;
  onChange: (coupon: Coupon | null) => void;
}

export function CouponInput({ subtotal, applied, onChange }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleApply(event: React.FormEvent) {
    event.preventDefault();
    if (!code.trim()) {
      setError("Enter a coupon code");
      return;
    }
    setChecking(true);
    const result = await couponStore.validate(code, subtotal);
    setChecking(false);
    if (result.coupon) {
      setError("");
      setCode("");
      onChange(result.coupon);
    } else {
      setError(result.error);
    }
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded bg-brand-soft px-3 py-2" role="status">
        <p className="text-sm">
          <span className="font-bold text-brand-dark">{applied.code}</span> applied — {applied.description}
        </p>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs font-bold uppercase text-primary hover:underline"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} noValidate>
      <label htmlFor="coupon-code" className="field-label">
        Have a coupon?
      </label>
      <div className="flex gap-2">
        <input
          id="coupon-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Try GREEN10"
          aria-describedby={error ? "coupon-error" : "coupon-hint"}
          className="field-input uppercase"
        />
        <button type="submit" disabled={checking} className="btn-outline px-4">
          {checking ? "..." : "Apply"}
        </button>
      </div>
      {error ? (
        <p id="coupon-error" role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      ) : (
        <p id="coupon-hint" className="mt-1 text-xs text-muted">
          Codes: GREEN10, WELCOME200
        </p>
      )}
    </form>
  );
}
