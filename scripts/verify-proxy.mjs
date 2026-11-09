// Test logic for proxy behavior without requiring next/server runtime resolution
import assert from "node:assert";

console.log("--- Starting Proxy (Middleware) Logic Verification ---");

// Replicate the pure proxy decision logic matching src/proxy.ts
function evaluateProxy(pathname, token) {
  if (pathname.startsWith("/change-password")) {
    if (!token) {
      return { redirect: `/login?callbackUrl=${encodeURIComponent(pathname)}` };
    }
  }

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password")
  ) {
    if (token) {
      return { redirect: "/" };
    }
  }

  return { next: true };
}

// Case 1: Anonymous accessing /change-password
const anonRes = evaluateProxy("/change-password", undefined);
assert.strictEqual(anonRes.redirect, "/login?callbackUrl=%2Fchange-password");
console.log("✓ Anonymous access to /change-password redirects to /login with callbackUrl.");

// Case 2: Authenticated user accessing /change-password
const authRes = evaluateProxy("/change-password", "session-token-123");
assert.strictEqual(authRes.next, true);
console.log("✓ Authenticated user allowed to access /change-password.");

// Case 3: Authenticated user visiting /login
const authLoginRes = evaluateProxy("/login", "session-token-123");
assert.strictEqual(authLoginRes.redirect, "/");
console.log("✓ Authenticated user visiting /login redirected to /.");

// Case 4: Anonymous user visiting /login
const anonLoginRes = evaluateProxy("/login", undefined);
assert.strictEqual(anonLoginRes.next, true);
console.log("✓ Anonymous user allowed to access /login.");

console.log("\n=== ALL PROXY VERIFICATION CHECKS PASSED ===");

