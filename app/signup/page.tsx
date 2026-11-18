"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthShell } from "@/components/AuthShell";
import { signup } from "@/lib/stores/auth-store";
import { validateEmail, validatePassword, validatePhone, validateRequired } from "@/lib/validation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const errors = {
    name: validateRequired(name, "Name"),
    email: validateEmail(email),
    phone: validatePhone(phone),
    password: validatePassword(password),
    confirm: confirm === password ? "" : "Passwords do not match",
  };
  const isValid = Object.values(errors).every((message) => !message);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) {
      setSubmitted(true);
      return;
    }
    setBusy(true);
    setFormError("");
    const created = await signup(name, email, phone, password);
    setBusy(false);
    if (!created) {
      setFormError("An account with this email already exists");
      return;
    }
    toast.success("Account created — welcome to Green Go!");
    router.push("/");
  }

  function renderField(
    field: keyof typeof errors,
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: { type?: string; helper: string; autoComplete?: string },
  ) {
    const id = `signup-${field}`;
    const showError = submitted && errors[field];
    return (
      <div>
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        <input
          id={id}
          type={options.type ?? "text"}
          autoComplete={options.autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={`${id}-help`}
          className="field-input"
        />
        <p id={`${id}-help`} className={`mt-1 text-xs ${showError ? "text-danger" : "text-muted"}`}>
          {showError ? errors[field] : options.helper}
        </p>
      </div>
    );
  }

  return (
    <AuthShell title="Create account" subtitle="Join Green Go to save favourites and track orders.">
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        {renderField("name", "Full name", name, setName, { helper: "As you would like it on your orders", autoComplete: "name" })}
        {renderField("email", "Email", email, setEmail, { type: "email", helper: "We will send order updates here", autoComplete: "email" })}
        {renderField("phone", "Mobile number", phone, setPhone, { type: "tel", helper: "10-digit number starting with 6-9", autoComplete: "tel" })}
        {renderField("password", "Password", password, setPassword, { type: "password", helper: "At least 6 characters", autoComplete: "new-password" })}
        {renderField("confirm", "Confirm password", confirm, setConfirm, { type: "password", helper: "Re-enter your password", autoComplete: "new-password" })}
        {formError && (
          <p role="alert" className="rounded bg-primary-soft px-3 py-2 text-sm text-danger">
            {formError}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Creating account…" : "Sign up"}
        </button>
      </form>
      <p className="mt-6 text-center text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
