export const STORE_EVENT = "gg:store-change";

export function readList<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw) as T[];
    } catch {
      // fall through to re-seed on corrupted data
    }
  }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

export function writeList<T>(key: string, list: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(list));
  window.dispatchEvent(new Event(STORE_EVENT));
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
