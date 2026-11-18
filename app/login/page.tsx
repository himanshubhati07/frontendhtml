"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthShell } from "@/components/AuthShell";
import { login } from "@/lib/stores/auth-store";
import { validateEmail, validatePassword } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  // MOCK: prefilled with the demo login — remove before wiring a real backend.
  const [email, setEmail] = useState("demo@greengo.com");
  // MOCK: prefilled with the demo password — remove before wiring a real backend.
  const [password, setPassword] = useState("password123");
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const isValid = !emailError && !passwordError;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) {
      setSubmitted(true);
      return;
    }
    setBusy(true);
    setLoginError("");
    const success = await login(email, password);
    setBusy(false);
    if (!success) {
      setLoginError("Invalid email or password");
      return;
    }
    toast.success("Welcome back!");
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next && next.startsWith("/") ? next : "/");
  }

  function handleSocialLogin(provider: string) {
    // MOCK: social login is not backed by a real provider yet.
    toast(`${provider} login is not available in this demo`);
  }

  return (
    <AuthShell title="Login" subtitle="Welcome back! Log in to continue shopping.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="login-email" className="field-label">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby="login-email-error"
            className="field-input"
          />
          {submitted && emailError && (
            <p id="login-email-error" className="mt-1 text-xs text-danger">
              {emailError}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="login-password" className="field-label">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-describedby="login-password-help"
            className="field-input"
          />
          <p id="login-password-help" className={`mt-1 text-xs ${submitted && passwordError ? "text-danger" : "text-muted"}`}>
            {submitted && passwordError ? passwordError : "At least 6 characters"}
          </p>
        </div>
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        {loginError && (
          <p role="alert" className="rounded bg-primary-soft px-3 py-2 text-sm text-danger">
            {loginError}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Logging in…" : "Login"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        OR
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="btn-outline px-3 py-2 text-xs" onClick={() => handleSocialLogin("Google")}>
          Google
        </button>
        <button type="button" className="btn-outline px-3 py-2 text-xs" onClick={() => handleSocialLogin("Facebook")}>
          Facebook
        </button>
      </div>

      <p className="mt-6 text-center text-muted">
        New to Green Go?{" "}
        <Link href="/signup" className="font-bold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
