export function getSafeRedirectUrl(target: string | null | undefined, fallback = "/"): string {
  if (!target || typeof target !== "string") {
    return fallback;
  }

  const trimmed = target.trim();
  if (trimmed === "" || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return fallback;
  }

  try {
    // Repeatedly decode to unwrap multi-layer URL encoding (e.g. %2F%09, %252F, etc.)
    let decoded = trimmed;
    for (let i = 0; i < 3; i++) {
      try {
        const next = decodeURIComponent(decoded);
        if (next === decoded) break;
        decoded = next;
      } catch {
        break;
      }
    }

    // Reject any ASCII control characters, whitespace (including \t, \r, \n) or backslashes
    if (/[\s\x00-\x1f\x7f\\]/.test(decoded)) {
      return fallback;
    }

    // Parse candidate relative to fixed localhost origin
    const parsed = new URL(decoded, "http://localhost");

    // Origin must remain strictly http://localhost
    if (parsed.origin !== "http://localhost") {
      return fallback;
    }

    // Normalized pathname must start with single slash and never double slash
    if (!parsed.pathname.startsWith("/") || parsed.pathname.startsWith("//")) {
      return fallback;
    }

    // Reject auth loops (/login, /register)
    if (parsed.pathname === "/login" || parsed.pathname === "/register") {
      return fallback;
    }

    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return fallback;
  }
}
