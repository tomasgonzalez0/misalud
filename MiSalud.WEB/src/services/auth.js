import { apiFetch } from "./apiClient";
import { extractRolesFromPayload } from "../utils/roles";

/**
 * Login normal contra backend.
 * Si las credenciales son las de la secretaria de desarrollo,
 * devolvemos un token falso sin llamar al backend.
 */
export async function loginRequest(userNameOrEmail, password) {
  // Atajo DEV secretaria (NO se llama al backend)
  const DEV_EMAIL = "secretaria@misalud.test";
  const DEV_PASS = "Secretaria123";

  if (
    userNameOrEmail.toLowerCase() === DEV_EMAIL.toLowerCase() &&
    password === DEV_PASS
  ) {
    const token = createDevSecretariaToken();
    return { token, raw: { token, dev: true, role: "Secretaria" } };
  }

  const res = await apiFetch("/api/Auth/login", {
    method: "POST",
    body: JSON.stringify({ userNameOrEmail, password })
  });

  if (!res.ok) {
    let msg = "Credenciales inválidas";
    try {
      const data = await res.json();
      msg = data.message || data.error || msg;
    } catch {}
    throw new Error(msg);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Respuesta inválida del servidor");
  }

  const token =
    data.token ||
    data.accessToken ||
    data.jwt ||
    data.value ||
    data.Token ||
    null;

  if (!token) {
    console.warn("Respuesta login sin token reconocible:", data);
    throw new Error("Token no recibido. Revisa backend.");
  }

  return { token, raw: data };
}

export function storeSession(token) {
  localStorage.setItem("token", token);
  const payload = decodeJWT(token);
  if (payload) {
    // Adjuntar roles ya normalizados
    const roles = extractRolesFromPayload(payload);
    const enriched = { ...payload, roles };
    localStorage.setItem("authUser", JSON.stringify(enriched));
    return enriched;
  }
  return payload;
}

export function decodeJWT(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getStoredUser() {
  try {
    const s = localStorage.getItem("authUser");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("authUser");
}

/* Utilidad: crear un token JWT "falso" para la secretaria dev */
function createDevSecretariaToken() {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: "dev-secretaria",
    email: "secretaria@misalud.test",
    unique_name: "secretaria",
    displayName: "Secretaría Demo",
    role: "Secretaria",
    secretaria: "1",
    iat: now,
    exp: now + 8 * 3600, // 8 horas
    dev: "1"
  };

  const encode = (obj) =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const unsigned = `${encode(header)}.${encode(payload)}`;
  const fakeSignature = "devsignature"; // No importa para front
  return `${unsigned}.${fakeSignature}`;
}