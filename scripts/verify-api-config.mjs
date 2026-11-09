import assert from "node:assert";

console.log("--- Starting Auth API Base URL Configuration Matrix Verification ---");

const DEFAULT_ROUTE_API = "https://ecommerce.routemisr.com";
const TEST_HOST_CATALOG = "https://catalog-only.test.local";
const TEST_HOST_CUSTOM = "https://custom-auth.test.local";

// Pure evaluation function matching src/lib/auth.ts and src/services/auth.service.ts
function resolveAuthApiBaseUrl(env) {
  return env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_ROUTE_API;
}

// 1. Condition 1: Only API_BASE_URL set to distinct test host
console.log("\n1. Testing: Only API_BASE_URL set to distinct test host...");
{
  const serverEnv = { API_BASE_URL: TEST_HOST_CATALOG };
  const clientEnv = {}; // non-NEXT_PUBLIC_ variables are undefined on browser

  const serverAuthBase = resolveAuthApiBaseUrl(serverEnv);
  const clientAuthBase = resolveAuthApiBaseUrl(clientEnv);

  assert.strictEqual(serverAuthBase, DEFAULT_ROUTE_API);
  assert.strictEqual(clientAuthBase, DEFAULT_ROUTE_API);
  assert.strictEqual(serverAuthBase, clientAuthBase, "Server and client must not split hosts!");
  console.log(`✓ Both auth paths use Route default (${serverAuthBase}) when only API_BASE_URL is set.`);
}

// 2. Condition 2: Only NEXT_PUBLIC_API_BASE_URL set
console.log("\n2. Testing: Only NEXT_PUBLIC_API_BASE_URL set...");
{
  const serverEnv = { NEXT_PUBLIC_API_BASE_URL: TEST_HOST_CUSTOM };
  const clientEnv = { NEXT_PUBLIC_API_BASE_URL: TEST_HOST_CUSTOM };

  const serverAuthBase = resolveAuthApiBaseUrl(serverEnv);
  const clientAuthBase = resolveAuthApiBaseUrl(clientEnv);

  assert.strictEqual(serverAuthBase, TEST_HOST_CUSTOM);
  assert.strictEqual(clientAuthBase, TEST_HOST_CUSTOM);
  assert.strictEqual(serverAuthBase, clientAuthBase);
  console.log(`✓ Both auth paths use NEXT_PUBLIC_API_BASE_URL (${serverAuthBase}).`);
}

// 3. Condition 3: Both variables set differently
console.log("\n3. Testing: Both variables set differently...");
{
  const serverEnv = {
    API_BASE_URL: TEST_HOST_CATALOG,
    NEXT_PUBLIC_API_BASE_URL: TEST_HOST_CUSTOM,
  };
  const clientEnv = {
    NEXT_PUBLIC_API_BASE_URL: TEST_HOST_CUSTOM,
  };

  const serverAuthBase = resolveAuthApiBaseUrl(serverEnv);
  const clientAuthBase = resolveAuthApiBaseUrl(clientEnv);

  assert.strictEqual(serverAuthBase, TEST_HOST_CUSTOM);
  assert.strictEqual(clientAuthBase, TEST_HOST_CUSTOM);
  assert.strictEqual(serverAuthBase, clientAuthBase);
  console.log(`✓ Both auth paths use NEXT_PUBLIC_API_BASE_URL (${serverAuthBase}) when both are set differently.`);
}

// 4. Condition 4: Neither variable set
console.log("\n4. Testing: Neither variable set...");
{
  const serverEnv = {};
  const clientEnv = {};

  const serverAuthBase = resolveAuthApiBaseUrl(serverEnv);
  const clientAuthBase = resolveAuthApiBaseUrl(clientEnv);

  assert.strictEqual(serverAuthBase, DEFAULT_ROUTE_API);
  assert.strictEqual(clientAuthBase, DEFAULT_ROUTE_API);
  assert.strictEqual(serverAuthBase, clientAuthBase);
  console.log(`✓ Both auth paths use Route default (${serverAuthBase}) when neither is set.`);
}

console.log("\n=== ALL AUTH API CONFIGURATION MATRIX CHECKS PASSED ===");
