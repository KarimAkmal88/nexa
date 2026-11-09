import assert from "node:assert";
import {
  loginSchema,
  registerSchema,
  forgotPasswordEmailSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
  changePasswordSchema,
  newPasswordSchema,
} from "../src/lib/validations/auth.ts";
import { getSafeRedirectUrl } from "../src/lib/safeRedirect.ts";
import { authOptions } from "../src/lib/auth.ts";

console.log("--- Starting F1 Form Validation & UX Corrections Verification ---");

// 1. Safe Redirect Verification
console.log("\n1. Testing getSafeRedirectUrl...");
const redirectTests = [
  { input: "%2F%09%2Fexample.test%2Flanding", expected: "/" },
  { input: "/%09/example.test/landing", expected: "/" },
  { input: "/\t/example.test/landing", expected: "/" },
  { input: "/login?callbackUrl=%2F%09%2Fexample.test%2Flanding", expected: "/" },
  { input: "//evil.com", expected: "/" },
  { input: "/\\evil.com", expected: "/" },
  { input: "/a/..//example.test", expected: "/" },
  { input: "/%2e%2e//example.test", expected: "/" },
  { input: "https://evil.com", expected: "/" },
  { input: "javascript:alert(1)", expected: "/" },
  { input: "/login", expected: "/" },
  { input: "/register", expected: "/" },
  { input: "", expected: "/" },
  { input: null, expected: "/" },
  { input: undefined, expected: "/" },
  { input: "/change-password", expected: "/change-password" },
  { input: "/products", expected: "/products" },
  { input: "/products?page=2#specs", expected: "/products?page=2#specs" },
  { input: "/cart", expected: "/cart" },
  { input: "/", expected: "/" },
];

for (const { input, expected } of redirectTests) {
  const result = getSafeRedirectUrl(input);
  assert.strictEqual(
    result,
    expected,
    `getSafeRedirectUrl(${JSON.stringify(input)}) failed: got ${result}, expected ${expected}`
  );
}
console.log(`✓ All ${redirectTests.length} redirect cases verified.`);

// 2. Password Complexity Tests
console.log("\n2. Testing Password Complexity Rules (new passwords only)...");
// Requirements: Min 8 chars, at least one uppercase, lowercase, number, special char
assert.strictEqual(newPasswordSchema.safeParse("Pass@123").success, true, "Valid 8-char complex password must pass");
assert.strictEqual(newPasswordSchema.safeParse("NexaSecurity#2026").success, true);
assert.strictEqual(newPasswordSchema.safeParse("short1!").success, false, "Must reject < 8 chars");
assert.strictEqual(newPasswordSchema.safeParse("password123!").success, false, "Must reject no uppercase");
assert.strictEqual(newPasswordSchema.safeParse("PASSWORD123!").success, false, "Must reject no lowercase");
assert.strictEqual(newPasswordSchema.safeParse("Password!@#").success, false, "Must reject no number");
assert.strictEqual(newPasswordSchema.safeParse("Password123").success, false, "Must reject no special character");
console.log("✓ newPasswordSchema complexity rules verified.");

// 3. Login & Current Password: must NOT enforce new complexity rules
console.log("\n3. Testing Login and Current Password (complexity NOT enforced)...");
// Legacy simple password must still be accepted on login
assert.strictEqual(loginSchema.safeParse({ email: "user@example.com", password: "simple" }).success, true);
assert.strictEqual(loginSchema.safeParse({ email: "user@example.com", password: "password123" }).success, true);
assert.strictEqual(loginSchema.safeParse({ email: "user@example.com", password: "123" }).success, false, "Login still enforces min 6 chars");

// Change password: currentPassword accepts simple password; new password requires complexity
assert.strictEqual(
  changePasswordSchema.safeParse({
    currentPassword: "oldpassword", // simple password permitted
    password: "NewComplex@2026",    // complex required
    rePassword: "NewComplex@2026",
  }).success,
  true
);
assert.strictEqual(
  changePasswordSchema.safeParse({
    currentPassword: "oldpassword",
    password: "simplepassword", // fails complexity
    rePassword: "simplepassword",
  }).success,
  false,
  "New password must fail if it lacks complexity"
);
console.log("✓ Login and current password successfully preserve legacy format while new passwords require complexity.");

// 4. Registration Schema Tests
console.log("\n4. Testing Registration Schema & UX fields...");
const validRegister = {
  name: "Ahmed Ali",
  email: "ahmed@example.com",
  phone: "01012345678",
  password: "NewPassword@2026",
  rePassword: "NewPassword@2026",
};
assert.strictEqual(registerSchema.safeParse(validRegister).success, true);

// Invalid phone (not Egyptian 01[0125]XXXXXXXX)
assert.strictEqual(registerSchema.safeParse({ ...validRegister, phone: "01312345678" }).success, false);
assert.strictEqual(registerSchema.safeParse({ ...validRegister, phone: "12345678" }).success, false);

// Password confirmation mismatch
assert.strictEqual(registerSchema.safeParse({ ...validRegister, rePassword: "DifferentPassword@2026" }).success, false);

// Untouched / empty fields test: invalid submission must fail schema parse (preventing API calls)
assert.strictEqual(registerSchema.safeParse({ name: "", email: "", phone: "", password: "", rePassword: "" }).success, false);
console.log("✓ Registration schema and phone format validation verified.");

// 5. Password Reset Schema
assert.strictEqual(forgotPasswordEmailSchema.safeParse({ email: "user@example.com" }).success, true);
assert.strictEqual(verifyResetCodeSchema.safeParse({ resetCode: "123456" }).success, true);
assert.strictEqual(
  resetPasswordSchema.safeParse({ email: "user@example.com", newPassword: "ResetPassword@2026" }).success,
  true
);
assert.strictEqual(
  resetPasswordSchema.safeParse({ email: "user@example.com", newPassword: "simple" }).success,
  false,
  "Reset password must require complexity"
);
console.log("✓ Reset password complexity verified.");

// 6. NextAuth Configuration & Callbacks
console.log("\n6. Testing NextAuth Configuration & Callbacks...");
assert.strictEqual(authOptions.session?.strategy, "jwt");
assert.strictEqual(authOptions.pages?.signIn, "/login");
assert.strictEqual(authOptions.providers.length, 1);
assert.strictEqual(authOptions.providers[0].name, "Credentials");

const mockToken = {};
const mockUser = {
  id: "u123",
  name: "Karim Test",
  email: "karim@test.com",
  role: "user",
  token: "route-api-jwt-token-string",
};

const updatedToken = await authOptions.callbacks.jwt({
  token: mockToken,
  user: mockUser,
});
assert.strictEqual(updatedToken.token, "route-api-jwt-token-string");

const updatedSession = await authOptions.callbacks.session({
  session: { user: { name: "", email: "" }, expires: "2026-12-31" },
  token: updatedToken,
});
assert.strictEqual(updatedSession.token, "route-api-jwt-token-string");
assert.strictEqual(updatedSession.user?.name, "Karim Test");
console.log("✓ NextAuth callbacks verified.");

console.log("\n=== ALL F1 FORM VALIDATION & UX CHECKS PASSED ===");
