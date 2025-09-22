const API_BASE = import.meta.env.VITE_API_BASE || "https://localhost:7169";

export function getApiBase() {
  return API_BASE;
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (res.status === 401) {
    window.dispatchEvent(new Event("auth:unauthorized"));
  }
  return res;
}