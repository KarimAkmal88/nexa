import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";

// Ensure robust ESM/CJS interop for CredentialsProvider across Next.js and Node runtimes
const Credentials =
  typeof CredentialsProvider === "function"
    ? CredentialsProvider
    : (CredentialsProvider as unknown as { default: typeof CredentialsProvider }).default;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok || data.message !== "success" || !data.token) {
            return null;
          }

          return {
            id: data.user?.email || credentials.email,
            name: data.user?.name || "User",
            email: data.user?.email || credentials.email,
            role: data.user?.role || "user",
            token: data.token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token;
        token.role = user.role;
        token.user = {
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.token = token.token;
        if (session.user) {
          session.user.name = token.user?.name || session.user.name;
          session.user.email = token.user?.email || session.user.email;
          session.user.role = token.role || token.user?.role;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
