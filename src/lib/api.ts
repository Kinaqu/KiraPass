const DEFAULT_API_BASE_URL = "https://kirapass-api.dimer133745.workers.dev";

export function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_KIRAPASS_API_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl()}${normalizedPath}`;
}
