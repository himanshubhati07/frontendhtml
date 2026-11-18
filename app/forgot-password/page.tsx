"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { validateEmail } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const emailError = validateEmail(email);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (emailError) return;
    // MOCK: no reset email is actually sent; real flow needs POST /api/auth/forgot-password.
    setSent(true);
  }

  return (
    <AuthShell title="Forgot password" subtitle="Enter your email and we will send you a reset link.">
      {sent ? (
        <p role="status" className="rounded bg-brand-soft px-3 py-3 text-brand-dark">
          If an account exists for {email}, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="field-label">
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-describedby="forgot-email-error"
              className="field-input"
            />
            {submitted && emailError && (
              <p id="forgot-email-error" className="mt-1 text-xs text-danger">
                {emailError}
              </p>
            )}
          </div>
          <button type="submit" className="btn-primary w-full">
            Send reset link
          </button>
        </form>
      )}
      <p className="mt-6 text-center">
        <Link href="/login" className="font-bold text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
}
