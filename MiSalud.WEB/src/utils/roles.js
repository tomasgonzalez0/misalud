// Normaliza y extrae roles desde el payload
export function extractRolesFromPayload(payload = {}) {
  if (!payload) return [];
  let roles = [];

  // role (string o array)
  if (payload.role) {
    if (Array.isArray(payload.role)) roles = roles.concat(payload.role);
    else roles.push(payload.role);
  }
  // roles (otra clave posible)
  if (payload.roles) {
    if (Array.isArray(payload.roles)) roles = roles.concat(payload.roles);
    else roles.push(payload.roles);
  }

  // Claim especial dev de secretaria
  if (payload.secretaria === "1" || payload.secretaria === 1) {
    roles.push("Secretaria");
  }

  const norm = roles
    .filter(Boolean)
    .map(r => r.trim())
    .map(r => r.charAt(0).toUpperCase() + r.slice(1).toLowerCase());

  return [...new Set(norm)];
}