export function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_KIRAPASS_API_URL ?? "").replace(/\/$/, "");
}

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl()}${normalizedPath}`;
}
