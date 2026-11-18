import toast from "react-hot-toast";
import { API_URL } from "@/lib/api-client";
import { mockUsers } from "@/lib/mock-data";
import { STORE_EVENT, newId } from "@/lib/stores/storage";
import type { SessionUser, User } from "@/types";

const USERS_KEY = "app_users";
const TOKEN_KEY = "auth_token";

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

export function getUsers(): User[] {
  if (typeof window === "undefined") return mockUsers;
  const raw = localStorage.getItem(USERS_KEY);
  const signedUp: User[] = raw ? JSON.parse(raw) : [];
  return [...mockUsers, ...signedUp];
}

function toSession(user: User): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

function saveSession(session: SessionUser): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(STORE_EVENT));
}

// MOCK: stands in for POST /api/auth/login returning a session token + user.
function localLogin(email: string, password: string): boolean {
  const match = getUsers().find(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.password === password,
  );
  if (!match) return false;
  saveSession(toSession(match));
  return true;
}

// MOCK: stands in for POST /api/auth/signup creating a user record.
function localSignup(
  name: string,
  email: string,
  phone: string,
  password: string,
): SessionUser | null {
  if (getUsers().some((user) => user.email.toLowerCase() === email.trim().toLowerCase())) {
    return null;
  }
  const user: User = {
    id: newId(),
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    password,
    role: "user",
  };
  const raw = localStorage.getItem(USERS_KEY);
  const signedUp: User[] = raw ? JSON.parse(raw) : [];
  localStorage.setItem(USERS_KEY, JSON.stringify([...signedUp, user]));
  const session = toSession(user);
  saveSession(session);
  return session;
}

export async function login(email: string, password: string): Promise<boolean> {
  if (USE_MOCK) return localLogin(email, password);
  // Deliberately NOT apiFetch(): a 401 is shown inline by the Login page.
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return false;
    saveSession((await res.json()) as SessionUser);
    return true;
  } catch (err) {
    toast.error("Could not reach the server — try again.");
    throw err;
  }
}

export async function signup(
  name: string,
  email: string,
  phone: string,
  password: string,
): Promise<SessionUser | null> {
  if (USE_MOCK) return localSignup(name, email, phone, password);
  try {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });
    if (!res.ok) return null;
    const session = (await res.json()) as SessionUser;
    saveSession(session);
    return session;
  } catch (err) {
    toast.error("Could not reach the server — try again.");
    throw err;
  }
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(STORE_EVENT));
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(TOKEN_KEY) !== null;
}

export function currentUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function currentRole(): string | null {
  return currentUser()?.role ?? null;
}

// MOCK: stands in for PUT /api/user/profile.
export function updateProfile(changes: { name: string; phone: string }): SessionUser | null {
  const session = currentUser();
  if (!session || typeof window === "undefined") return null;
  const updated: SessionUser = { ...session, ...changes };
  const raw = localStorage.getItem(USERS_KEY);
  const signedUp: User[] = raw ? JSON.parse(raw) : [];
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(signedUp.map((user) => (user.id === session.id ? { ...user, ...changes } : user))),
  );
  saveSession(updated);
  return updated;
}
