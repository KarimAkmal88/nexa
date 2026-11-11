export function getSafeRedirectUrl(target: string | null | undefined, fallback = "/"): string {
  if (!target || typeof target !== "string") {
    return fallback;
  }

  const trimmed = target.trim();
  if (trimmed === "" || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return fallback;
  }

  try {
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

    if (/[\s\x00-\x1f\x7f\\]/.test(decoded)) {
      return fallback;
    }

    const parsed = new URL(decoded, "http://localhost");

    if (parsed.origin !== "http://localhost") {
      return fallback;
    }

    if (!parsed.pathname.startsWith("/") || parsed.pathname.startsWith("//")) {
      return fallback;
    }

    if (parsed.pathname === "/login" || parsed.pathname === "/register") {
      return fallback;
    }

    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return fallback;
  }
}
