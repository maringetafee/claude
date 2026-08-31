const STORAGE_KEY = "inmo-retail:favorites";

type Listener = () => void;

const listeners = new Set<Listener>();
const EMPTY: string[] = [];
let cache: string[] | null = null;

function read(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function write(ids: string[]) {
  cache = ids;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage unavailable (private mode, quota) — favorites just won't persist.
  }
  listeners.forEach((listener) => listener());
}

export function getSnapshot(): string[] {
  if (cache === null) cache = read();
  return cache;
}

export function getServerSnapshot(): string[] {
  return EMPTY;
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isFavorite(id: string): boolean {
  return getSnapshot().includes(id);
}

export function toggleFavorite(id: string) {
  const current = getSnapshot();
  const next = current.includes(id)
    ? current.filter((existing) => existing !== id)
    : [...current, id];
  write(next);
}
